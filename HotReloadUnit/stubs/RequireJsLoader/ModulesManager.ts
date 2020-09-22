const defaultManagerName = 'RequireJsLoader/ModulesManager';

export class DefaultManager {
    onModuleLoaded(): void {
        return;
    }
}

export default function setUp(
    managerName: string = defaultManagerName,
    ManagerConstructror: Function = DefaultManager
): () => void {
    define(managerName, () => ManagerConstructror);

    return function tearDown(): void {
        requirejs.undef(managerName);
    }
}
