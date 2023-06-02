export type ModulesManagerConstructor = new() => IModulesManager;

/**
 * Интерфейс менеджера модулей
 */
export default interface IModulesManager {
    /**
     * Загружает модули с указанными именами
     * @param modules Имена модулей для загрузки
     * @returns Загруженные модули
     */
    load<T>(modules: string[]): Promise<T>;

    /**
     * Выгружает модули с указанными именами
     * @param modules Имена модулей для загрузки
     */
    unload(modules: string[]): Promise<void>;
}
