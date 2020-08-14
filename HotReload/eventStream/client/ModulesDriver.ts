import IModulesDriver, {ModuleLoadCallback} from './IModulesDriver';
import {undefineFailedAncestorsInner} from 'RequireJsLoader/extras/errorHandler'

export default class ModulesDriver implements IModulesDriver {

    _loadedCallbacks: Set<ModuleLoadCallback<unknown>>;

    constructor() {
        this._loadedCallbacks = new Set();

        this._decorateOnResourceLoad();
    }

    load<T>(modules: string[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            requirejs(modules, (...modules) => {
                resolve(modules);
            }, (error) => {
                reject(error);
            });
        });
    }

    unload(modules: string[]): void {
        //@ts-ignore
        const context = requirejs.s && requirejs.s.contexts._;
        for (let name in modules) {
            undefineFailedAncestorsInner(name, context, new Set<string>());
        }
    }

    onModuleLoaded<T>(callback: ModuleLoadCallback<T>) {
        this._loadedCallbacks.add(callback);
    }


    offModuleLoaded<T>(callback: ModuleLoadCallback<T>): void {
        if (this._loadedCallbacks.has(callback)) {
            this._loadedCallbacks.delete(callback);
        }
    };

    _decorateOnResourceLoad() {
        const originalOnResourceLoad = requirejs.onResourceLoad;
        requirejs.onResourceLoad = (context, map, depArray): void => {
            this._loadedCallbacks.forEach((callback) => {
                callback.call(this,'name', map);
            });
            originalOnResourceLoad && originalOnResourceLoad(context, map, depArray);
        };
    }
}

