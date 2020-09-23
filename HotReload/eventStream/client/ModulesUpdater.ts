import IModulesHandler from './IModulesHandler';
import IModulesManager from './IModulesManager';

/**
 * Provides an ability to swap target within a Proxy
 */
class Swapper<T extends object> {
    protected _wrapper: T;

    set target(value: T) {
        Object.assign(this._target, value);
    }

    get wrapper(): T {
        return this._wrapper;
    }

    constructor(protected _target: T) {
        this._wrapper = new Proxy(this._target, {});
    }
}

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater<T extends object = object> {
    protected _registry: Map<string, Swapper<T>> = new Map();

    /**
     * Конструктор
     * @param manager Менеджер модулей
     */
    constructor(protected manager: IModulesManager & IModulesHandler) {
        manager.onModuleLoaded(this._onModuleLoad);
    }

    /**
     * Обновляет имплементации модулей
     * @param modules Имена модулей
     */
    async update(modules: string[]): Promise<void> {
        await this.manager.unload(modules);
        await this.manager.load(modules);
    }

    protected _onModuleLoad(name: string, implementation: T): T {
        if (!implementation || typeof implementation !== 'object') {
            return implementation;
        }

        let swapper: Swapper<T>;

        if (this._registry.has(name)) {
            swapper = this._registry.get(name);
            swapper.target = implementation;
        } else {
            swapper = new Swapper(implementation);
            this._registry.set(name, swapper);
        }

        return swapper.wrapper;
    }
}
