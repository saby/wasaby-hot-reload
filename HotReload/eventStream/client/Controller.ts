import Connection, {IModulesUpdateEvent} from './Connection';
import ModulesUpdater from './ModulesUpdater';
import ComponentsUpdater from './ComponentsUpdater';
import IModulesManager, {ModulesManagerConstructor} from './IModulesManager';

const DEFAULT_MODULES_DRIVER = 'RequireJsLoader/Driver';

/**
 * Контроллер, организующий взаимодействие модулей, отвечающих за hot reload.
 */
export default class Controller {
    /**
     * "Обновлятор" модулей приложения
     */
    protected modulesUpdater: ModulesUpdater;

    /**
     * "Обновлятор" компонентов приложения
     */
    protected componentsUpdater: ComponentsUpdater;

    /**
     * Конструктор
     * @param driverName Имя загрузчика модулей
     * @param rootNode Корневая нода приложения
     */
    constructor(protected driverName: string = DEFAULT_MODULES_DRIVER, protected rootNode: ParentNode = document) {
        if (driverName) {
            this.driverName = driverName;
        }
    }

    /**
     * Запускает процесс настройки взаимодействия модулей
     */
    async run(): Promise<void> {
        const driver = await this.getModulesManager();
        this.modulesUpdater = new ModulesUpdater(driver);

        this.componentsUpdater = new ComponentsUpdater(this.rootNode);

        const connection = new Connection();
        connection.connect();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    /**
     * Загружает и инстанциирует загрузчик модулей
     */
    async getModulesManager(): Promise<IModulesManager> {
        const driverName = this.driverName;
        const DefaultDriver = await import(driverName) as ModulesManagerConstructor;
        return new DefaultDriver();
    }

    /**
     * Обработчик серверного события об изменении модулей
     */
    protected onModulesChange(event: IModulesUpdateEvent): void {
        const modulesList = event.data;
        if (!modulesList) {
            return;
        }
        // TODO: await?
        this.modulesUpdater.update(modulesList);
        this.componentsUpdater.update(modulesList);
    }
}
