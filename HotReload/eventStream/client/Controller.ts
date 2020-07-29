import Connection, {IModulesUpdateEvent} from './Connection';
import ModulesUpdater from './ModulesUpdater';
import IModulesDriver, {ModulesDriverConstructor} from './IModulesDriver';

const DEFAULT_MODULES_DRIVER = 'RequireJsLoader/Driver';

export default class Controller {
    protected updater: ModulesUpdater;

    constructor() {
    }

    async run(): Promise<void> {
        const driver = await this.getModulesDriver();
        this.updater = new ModulesUpdater(driver);

        const connection = new Connection();
        connection.on('modules-changed', this.onModulesChange.bind(this));
    }

    async getModulesDriver(): Promise<IModulesDriver> {
        const DefaultDriver = await import(DEFAULT_MODULES_DRIVER) as ModulesDriverConstructor;
        return new DefaultDriver();
    }

    protected onModulesChange(event: IModulesUpdateEvent) {
        const modulesList = event.data;
        if (!modulesList) {
            return;
        }
        this.updater.reset(modulesList);
    }
}
