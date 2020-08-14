export type ModuleLoadCallback<T> = (name: string, implementation: T) => void;

export type ModulesDriverConstructor = new() => IModulesDriver;

export default interface IModulesDriver {
    load<T>(modules: string[]): Promise<T[]>;
    unload(modules: string[]): void;
    onModuleLoaded<T>(callback: ModuleLoadCallback<T>): void;
    offModuleLoaded<T>(callback: ModuleLoadCallback<T>): void;
}
