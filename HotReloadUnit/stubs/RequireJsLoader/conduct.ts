const defaultManagerName = 'RequireJsLoader/conduct';

export class DefaultManager {
    onModuleLoaded(): void {
        return;
    }
}

export default function setUp(
    managerName: string = defaultManagerName,
    ManagerConstructror: object = {ModulesManager: DefaultManager}
): () => void {
    define(managerName, () => ManagerConstructror);

    return function tearDown(): void {
        requirejs.undef(managerName);
    }
}
