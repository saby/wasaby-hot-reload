import Connection, {IModulesUpdateEvent} from './Connection';
import ModulesUpdater from './ModulesUpdater';
import IModulesDriver, {ModulesDriverConstructor} from './IModulesDriver';

const DEFAULT_MODULES_DRIVER = 'RequireJsLoader/Driver';

export default class Controller {
    protected driverName: string = DEFAULT_MODULES_DRIVER;
    protected updater: ModulesUpdater;

    constructor(driverName?: string) {
        if (driverName) {
            this.driverName = driverName;
        }
    }

    async run(): Promise<void> {
        const driver = await this.getModulesDriver();
        this.updater = new ModulesUpdater(driver);

        const connection = new Connection();
        connection.connect();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    async getModulesDriver(): Promise<IModulesDriver> {
        const driverName = this.driverName;
        const DefaultDriver = await import(driverName) as ModulesDriverConstructor;
        return new DefaultDriver();
    }

    protected onModulesChange(event: IModulesUpdateEvent): void {
        const modulesList = event.data;
        if (!modulesList) {
            return;
        }
        this.updater.reset(modulesList);
    }
}
