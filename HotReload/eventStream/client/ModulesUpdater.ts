import IModulesHandler from './IModulesHandler';
import IModulesManager from './IModulesManager';

/**
 * Returns module name by its filename
 * @param fileName
 */
export function getModuleName(fileName: string): string {
    const parts = fileName.split('.');
    const ext = parts.pop();
    const module = parts.join('.');
    const plugin = ext === 'js' ? '' : ext + '!';

    return plugin + module;
}

/**
 * Provides an ability to rise a facade for a module and replace implementation when needed
 */
class ModuleRouter<T extends Function | ObjectConstructor | object> {
    /**
     * Facade which looks like target module
     */
    facade: T;

    /**
     * Router constructor
     * @param target Targget module to build facade for
     */
    constructor(public target: T) {
        this.facade = this._getFacade(this);
    }

    /**
     * Creates a facade that can switch to anoter implementation dyamically
     * @param context Context with dynamic swith
     */
    protected _getFacade(context: ModuleRouter<T>): T {
        return new Proxy(context.target, {
            get(target: T, prop: string): unknown {
                return context.target[prop];
            },
            set(target: T, prop: string, value: unknown): boolean {
                context.target[prop] = value;
                return true;
            },
            deleteProperty(target: T, prop: string): boolean {
                if (context.target.hasOwnProperty(prop)) {
                    delete context.target[prop];
                    return true;
                }
                return false;
            },
            has(target: T, prop: string): boolean {
                return context.target.hasOwnProperty(prop);
            },
            construct(target: T, args: unknown[]): object {
                return new (context.target as ObjectConstructor)(...args);
            },
            apply(target: T, that: object, args: unknown[]): unknown {
                return (context.target as Function).apply(that, args);
            }
        });
    }
}

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater<T extends object = object> {
    /**
     * Registry of replaced modules
     */
    protected _registry: Map<string, ModuleRouter<T>> = new Map();

    /**
     * Конструктор
     * @param manager Менеджер модулей
     */
    constructor(
        protected manager: IModulesManager & IModulesHandler
    ) {
        if (typeof Proxy !== 'undefined') {
            manager.onModuleLoaded(this._onModuleLoad.bind(this));
        }
    }

    /**
     * Обновляет имплементации модулей
     * @param modules Имена модулей
     */
    async update(modules: string[]): Promise<void> {
        await this.manager.unload(modules);
        await this.manager.load(modules);
    }

    /**
     * Replaces module implementation with router
     * @param name Module name
     * @param implementation Module implementation
     */
    protected _onModuleLoad(name: string, implementation: T): T {
        if (!implementation) {
            return implementation;
        }

        let router: ModuleRouter<T>;

        if (this._registry.has(name)) {
            router = this._registry.get(name);
            router.target = implementation;
        } else {
            router = new ModuleRouter(implementation);
            this._registry.set(name, router);
        }

        return router.facade;
    }
}
