import IModulesDriver from './IModulesDriver';

export default class ModulesUpdater {
    constructor(protected driver: IModulesDriver) {
    }

    async reset(modules: string[]): Promise<void> {
        this.driver.unload(modules);
        return this.driver.load(modules);
    }
}
