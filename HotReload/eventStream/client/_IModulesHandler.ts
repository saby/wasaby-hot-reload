export type ModuleLoadCallback<T> = (name: string, implementation: T) => void;

export type ModulesHandlerConstructor = new() => IModulesHandler;

/**
 * Интерфейс обработчика модулей
 */
export default interface IModulesHandler {
    /**
     * Подключает обработчик загрузки модуля
     * @param callback Обработчик
     */
    onModuleLoaded<T>(callback: ModuleLoadCallback<T>): void;

    /**
     * Отключает обработчик загрузки модуля
     * @param callback Обработчик
     */
    offModuleLoaded<T>(callback: ModuleLoadCallback<T>): void;
}
