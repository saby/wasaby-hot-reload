import Connection, {IModulesUpdateEvent} from './Connection';
import ModulesUpdater from './ModulesUpdater';
import IModulesDriver, {ModulesDriverConstructor} from './IModulesDriver';

const DEFAULT_MODULES_DRIVER = 'RequireJsLoader/Driver';

/**
 * Контроллер, организующий взаимодействие модулей, отвечающих за hot reload.
 */
export default class Controller {
    /**
     * Имя загрузчика модулей
     */
    protected driverName: string = DEFAULT_MODULES_DRIVER;

    /**
     * Модуль, отвечающий за обновление приложения
     */
    protected updater: ModulesUpdater;

    /**
     * Конструктор
     * @param driverName Имя загрузчика модулей
     */
    constructor(driverName?: string) {
        if (driverName) {
            this.driverName = driverName;
        }
    }

    /**
     * Запускает процесс настройки взаимодействия модулей
     */
    async run(): Promise<void> {
        const driver = await this.getModulesDriver();
        this.updater = new ModulesUpdater(driver);

        const connection = new Connection();
        connection.connect();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    /**
     * Загружает и инстанциирует загрузчик модулей
     */
    async getModulesDriver(): Promise<IModulesDriver> {
        const driverName = this.driverName;
        const DefaultDriver = await import(driverName) as ModulesDriverConstructor;
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
        this.updater.update(modulesList);
    }
}
