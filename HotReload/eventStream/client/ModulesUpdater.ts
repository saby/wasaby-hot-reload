import IModulesHandler from './IModulesHandler';
import IModulesManager from './IModulesManager';

/**
 * Обновляет имплементации загруженных модулей без перезапуска приложения
 */
export default class ModulesUpdater {
    protected _registry: Map<string, unknown> = new Map();

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

    protected _onModuleLoad<T extends object>(name: string, implementation: T): T {
        if (!implementation || typeof implementation !== 'object') {
            return implementation;
        }

        const wrapper = new Proxy(implementation, {});

        if (this._registry.has(name)) {
            // Swap target in proxy here
        }
        this._registry.set(name, {implementation, wrapper});

        return wrapper;
    }
}
