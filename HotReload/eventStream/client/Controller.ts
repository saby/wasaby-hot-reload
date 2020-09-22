import Connection, {IModulesUpdateEvent} from './Connection';
import ModulesUpdater from './ModulesUpdater';
import ComponentsUpdater from './ComponentsUpdater';
import IModulesManager from './IModulesManager';
import IModulesHandler from './IModulesHandler';

export type CompatModulesManagerConstructor = new() => IModulesManager & IModulesHandler;

interface ICompatModulesManagerConstructor {
    default: CompatModulesManagerConstructor;
    new(): IModulesManager & IModulesHandler;
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
     * Конструктор
     * @param managerName Имя загрузчика модулей
     * @param rootNode Корневая нода приложения
     */
    constructor(
        protected managerName: string = DEFAULT_MODULES_MANAGER,
        protected rootNode: ParentNode = document
    ) {
    }

    /**
     * Запускает процесс настройки взаимодействия модулей
     */
    async run(): Promise<void> {
        const manager = await this.getModulesManager();
        this.modulesUpdater = new ModulesUpdater(manager);

        this.componentsUpdater = new ComponentsUpdater(this.rootNode);

        const connection = new Connection();
        connection.connect();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    /**
     * Загружает и инстанциирует загрузчик модулей
     */
    async getModulesManager(): Promise<IModulesManager & IModulesHandler> {
        const managerName = this.managerName;
        const DefaultManager = await import(managerName) as ICompatModulesManagerConstructor;
        return DefaultManager.default ? new DefaultManager.default() : new DefaultManager();
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
