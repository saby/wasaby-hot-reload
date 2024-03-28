import Connection, {ConnectionConstructor, IModulesUpdateEvent} from './_Connection';
import ModulesUpdater, {getModuleName, isArtifact} from './_ModulesUpdater';
import ComponentsUpdater from './_ComponentsUpdater';
import IModulesManager from './_IModulesManager';
import IModulesHandler from './_IModulesHandler';

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

const DEFAULT_MODULES_MANAGER = 'RequireJsLoader/conduct:ModulesManager';
const CONTENTS_URL = 'json!HotReload/contents.json';

/**
 * Контроллер, организующий взаимодействие модулей, отвечающих за hot reload.
 */
export default class Controller {
    /**
     * Логгер
     */
    protected get logger(): typeof console {
        return console;
    }

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
    async run(loadExtra: boolean = false): Promise<void> {
        try {
            let notificationServer = this.options.config.staticServer;

            // Try to detect static server from module config till following bug will be fixed:
            // https://online.sbis.ru/opendoc.html?guid=99f39928-a7f8-461d-8822-bf11b8e81957
            if (!notificationServer && loadExtra) {
                try {
                    const extraConfig = await import(CONTENTS_URL);
                    notificationServer = extraConfig?.modules?.HotReload?.staticServer;
                } catch (err) {
                    this.logger.error(err);
                }
            }

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
            connection.on('error', this.onConnectionError.bind(this));
        } catch (err) {
            this.logger.error('Can\'t start the hot reload environment:', err.message);
        }
    }

    /**
     * Загружает и инстанциирует загрузчик модулей
     */
    async getModulesManager(): Promise<IModulesManager & IModulesHandler> {
        const [managerName, managerPath]: string[] = String(this.options.managerName).split(':');
        const ManagerExports = await import(managerName) as ICompatModulesManagerConstructor;
        const ManagerConstructor = managerPath ?
            ManagerExports[managerPath] :
            (ManagerExports.default ? ManagerExports.default : ManagerExports);

        return new ManagerConstructor({});
    }

    /**
     * Обработчик серверного события об изменении модулей
     */
    protected onModulesChange(event: IModulesUpdateEvent): void {
        const filesList = JSON.parse(event.data);
        if (!(filesList instanceof Array)) {
            return;
        }

        const modulesList = filesList
            .filter(isArtifact)
            .map(getModuleName);

        this.modulesUpdater.update(modulesList).then(() => {
            this.componentsUpdater.update(modulesList);
        });
    }

    /**
     * Обработчик ошибки соединения с сервером
     */
    protected onConnectionError(event: ErrorEvent): void {
        const target = event.target as EventSource;
        this.logger.error(`Can't connect to the hot reload event stream server at "${target.url}"`);
    }
}
