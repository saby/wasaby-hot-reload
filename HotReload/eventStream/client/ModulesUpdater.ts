import IModulesDriver from './IModulesDriver';

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater {
    /**
     * Конструктор
     * @param driver Загрузчик модулей
     */
    constructor(protected driver: IModulesDriver) {
    }

    /**
     * Обновляет имплементации модулей
     * @param modules Имена модулей
     */
    async update(modules: string[]): Promise<void> {
        this.driver.unload(modules);
        return this.driver.load(modules);
    }
}
