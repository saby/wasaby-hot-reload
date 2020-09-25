import Connection, {ConnectionConstructor, IModulesUpdateEvent} from './Connection';
import ModulesUpdater, {getModuleName} from './ModulesUpdater';
import ComponentsUpdater from './ComponentsUpdater';
import IModulesManager from './IModulesManager';
import IModulesHandler from './IModulesHandler';

export type CompatModulesManagerConstructor = new() => IModulesManager & IModulesHandler;

interface ICompatModulesManagerConstructor {
    default: CompatModulesManagerConstructor;
    new(): IModulesManager & IModulesHandler;
}

interface IModuleConfig {
    staticServer?: string;
}

interface IControllerOptions {
    config: IModuleConfig;
    managerName: string;
    connectionConstructor: ConnectionConstructor;
    rootNode: ParentNode;
}

const DEFAULT_MODULES_MANAGER = 'RequireJsLoader/ModulesManager';

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
     * Опции контроллера
     */
    protected options: IControllerOptions;

    /**
     * Конструктор
     * @param options Опции контроллера
     */
    constructor(options: Partial<IControllerOptions> = {}) {
        // Fill empty options with default values
        this.options = {...{
            config: {},
            managerName: DEFAULT_MODULES_MANAGER,
            connectionConstructor: Connection,
            rootNode: document
        }, ...options};
    }

    /**
     * Запускает процесс настройки взаимодействия модулей
     */
    async run(): Promise<void> {
        const notificationServer = this.options.config.staticServer;

        // Do nothing if staticServer is not defined
        if (!notificationServer) {
            return;
        }

        // Do nothing if dynamic modules update is not supported
        if (!ModulesUpdater.isSupported()) {
            return;
        }

        // Load modules manager
        const manager = await this.getModulesManager();

        // Create modules updater
        this.modulesUpdater = new ModulesUpdater(manager);

        // Create components updater
        this.componentsUpdater = new ComponentsUpdater(this.options.rootNode);

        // Connect to the notification server
        const [host, port]: string[] = String(notificationServer).split(':');
        const connection = new this.options.connectionConstructor(host, Number(port));
        connection.connect();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    /**
     * Загружает и инстанциирует загрузчик модулей
     */
    async getModulesManager(): Promise<IModulesManager & IModulesHandler> {
        const managerName = this.options.managerName;
        const DefaultManager = await import(managerName) as ICompatModulesManagerConstructor;
        return DefaultManager.default ? new DefaultManager.default() : new DefaultManager();
    }

    /**
     * Обработчик серверного события об изменении модулей
     */
    protected onModulesChange(event: IModulesUpdateEvent): void {
        const filesList = JSON.parse(event.data);
        if (!(filesList instanceof Array)) {
            return;
        }

        const modulesList = filesList.map(getModuleName);
        this.modulesUpdater.update(modulesList).then(() => {
            this.componentsUpdater.update(modulesList);
        });
    }
}
