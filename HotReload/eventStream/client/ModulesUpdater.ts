import IModulesManager from './IModulesManager';

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater {
    /**
     * Конструктор
     * @param manager Менеджер модулей
     */
    constructor(protected manager: IModulesManager) {
    }

    /**
     * Обновляет имплементации модулей
     * @param modules Имена модулей
     */
    async update(modules: string[]): Promise<void> {
        await this.manager.unload(modules);
        await this.manager.load(modules);
    }
}
