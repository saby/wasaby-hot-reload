import IModulesManager, { ModuleLoadCallback } from 'HotReload/eventStream/client/IModulesManager';

export default class ModulesManager implements IModulesManager {
    load<T>(modules: string[]): Promise<T> {
        ModulesManager.lastLoaded = modules;
        return Promise.resolve(undefined as T);
    }

    unload(modules: string[]): Promise<void> {
        ModulesManager.lastUnloaded = modules;
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
