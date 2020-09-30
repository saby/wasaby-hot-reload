import IModulesHandler from './IModulesHandler';
import IModulesManager from './IModulesManager';

const maxTraverseDepth = 10;
const $isProxy = Symbol('isProxy');
// tslint:disable-next-line: ban-comma-operator
export const superglobal = (0, eval)('this');

type RouterEntity = Function | ObjectConstructor | object;
export type CallableCallback = (scope: object, key: string, value: Function, path: string[]) => void;

/**
 * Returns module name by its filename
 * @param fileName
 */
export function getModuleName(fileName: string): string {
    const parts = fileName.split('.');
    const ext = parts.pop();
    const module = parts.join('.');
    const isScript = !ext || ext === 'js';
    const plugin = isScript ? '' : ext + '!';

    return plugin + module;
}

/**
 * Returns a flag that the file is an application source code artifact
 * @param fileName
 */
export function isArtifact(fileName: string): boolean {
    const parts = fileName.split('.');
    const ext = parts.pop();
    const isSource = ext === 'ts' || ext === 'less';
    return !isSource;
}

/**
 * Traverses all wrappable members deep within given object
 * @param object An object to traverse
 * @param callback Callback to call with each found member
 * @param path Path within 'object'
 * @param stack Currently traversing nodes
 */
export function eachWrappable(
    object: object,
    callback: CallableCallback,
    path: string[] = [],
    stack: Set<object> = new Set()
): void {
    // Deal with endless recursion and limit the depth
    if (stack.has(object) || path.length > maxTraverseDepth) {
        return;
    }

    // Skip if not an object (include functions)
    const objectType = typeof object;
    if (
        !object ||
        objectType !== 'object'
    ) {
        return;
    }

    // Skip objects which already wrapped
    if (object[$isProxy]) {
        return;
    }
    // Skip global root
    if (object === superglobal) {
        return;
    }

    // Push current node
    stack.add(object);

    // Go through object properties
    Object.getOwnPropertyNames(object).forEach((key) => {
        // Skip constructor in prototype because it points back to the class definition
        if (key === 'constructor' && path[path.length - 1] === 'prototype') {
            return;
        }

        // Deal with property using descriptior
        const descriptor = Object.getOwnPropertyDescriptor(object, key);

        // Skip access descriptors
        if (descriptor.get) {
            return;
        }

        // Get the propert value
        const value = descriptor.value;

        // Skip if not an object
        if (!value) {
            return;
        }

        // Calculate new path
        const newPath = [...path, key];

        // Go deeper
        eachWrappable(value, callback, newPath);

        // Deal with functions
        if (typeof value === 'function') {
            // Also lookup inside the prototype
            if (value.prototype) {
                eachWrappable(value.prototype, callback, [...newPath, 'prototype']);
            }

            // Call a handler for each function
            callback(object, key, value, newPath);
        }
    });

    // Remove current node
    stack.delete(object);
}

/**
 * Provides an ability to rise a facade for a module and replace the implementation on the fly when needed
 */
export class ModuleRouter<T extends RouterEntity> {
    /**
     * Facade which looks like target module
     */
    facade: T;

    protected actualTarget: T;

    get target(): T {
        return this.actualTarget || this.initialTarget;
    }

    set target(actualTarget: T) {
        this.actualTarget = actualTarget;

        Object.assign(this.handler, {
            get(target: T, prop: string): unknown {
                return actualTarget[prop];
            },
            set(target: T, prop: string, value: unknown): boolean {
                actualTarget[prop] = value;
                return true;
            },
            deleteProperty(target: T, prop: string): boolean {
                if (actualTarget.hasOwnProperty(prop)) {
                    delete actualTarget[prop];
                    return true;
                }
                return false;
            },
            has(target: T, prop: string): boolean {
                return actualTarget.hasOwnProperty(prop);
            },
            construct(target: T, args: unknown[]): object {
                return new (actualTarget as ObjectConstructor)(...args);
            },
            apply(target: T, that: object, args: unknown[]): unknown {
                return (actualTarget as Function).apply(that, args);
            }
        });
    }

    protected handler: ProxyHandler<T> = {};

    /**
     * Router constructor
     * @param target Target module to build facade for
     * @param key Entity target to identify during debug
     */
    constructor(protected initialTarget: T, public key: string) {
        this.facade = new Proxy(this.initialTarget, this.handler);
        this.facade[$isProxy] = true;
    }
}

/**
 * Updates entry record in registry
 * @param registry Registry of wrapped entities
 * @param key Registry key
 * @param original Entity's original
 */
export function setToRegistry<T extends RouterEntity>(
    registry: Map<string, ModuleRouter<T>>,
    key: string,
    original: T
): ModuleRouter<T> {
    // Replace target if entry is already registered
    if (registry.has(key)) {
        const oldEntry = registry.get(key);
        oldEntry.target = original;
        return oldEntry;
    }

    // Create a new entry
    const newEntry = new ModuleRouter(original, key);
    registry.set(key, newEntry);
    return newEntry;
}

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater<T extends object = object> {
    /**
     * Registry of wrapped modules
     */
    protected _registry: Map<string, ModuleRouter<T>> = new Map();

    /**
     * Конструктор
     * @param manager Менеджер модулей
     */
    constructor(
        protected manager: IModulesManager & IModulesHandler
    ) {
        manager.onModuleLoaded(this._onModuleLoad.bind(this));
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
     * Wraps or replaces module implementation with router
     * @param name Module name
     * @param implementation Module implementation
     */
    protected _onModuleLoad(name: string, implementation: T): T {
        // Skip if not an object or function
        if (!implementation) {
            return implementation;
        }
        const implementationType = typeof implementation;
        if (implementationType !== 'function' && implementationType !== 'object') {
            return implementation;
        }

        // Search for functions within the whole module
        eachWrappable(implementation, (scope, key, entryValue, path) => {
            // Wrap every function with facade
            const entryName = `${name}:${path.join('.')}`;
            scope[key] = setToRegistry(this._registry, entryName, entryValue as T).facade;
        });

        // Wrap the module with facade
        return setToRegistry(this._registry, name, implementation).facade;
    }

    /**
     * Returns flag that modules hot update is supported by the environment
     */
    static isSupported(): boolean {
        return typeof Proxy !== 'undefined';
    }
}
