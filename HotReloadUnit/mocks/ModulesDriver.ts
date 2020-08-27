import IModulesDriver, { ModuleLoadCallback } from 'HotReload/eventStream/client/IModulesDriver';

export default class ModulesDriver implements IModulesDriver {
    load<T>(modules: string[]): Promise<T> {
        ModulesDriver.lastLoaded = modules;
        return Promise.resolve(undefined as T);
    }

    unload(modules: string[]): Promise<void> {
        ModulesDriver.lastUnloaded = modules;
        return Promise.resolve();
    }

    onModuleLoaded<T>(callback: ModuleLoadCallback<T>): void {
        //
    }

    offModuleLoaded<T>(callback: ModuleLoadCallback<T>): void {
        //
    }

    static lastLoaded: string[];
    static lastUnloaded: string[];
}
