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
    /** т.к. по умолчанию managerName это 'RequireJsLoader/conduct', то уже кто-то мог его загрузить
     * поэтому необходимо сначала убрать из "кэша" require 'RequireJsLoader/conduct'
     * а потом уже объявить фейковый модуль
     */
    requirejs.undef(managerName);
    define(managerName, () => ManagerConstructror);

    return function tearDown(): void {
        requirejs.undef(managerName);
    };
}
