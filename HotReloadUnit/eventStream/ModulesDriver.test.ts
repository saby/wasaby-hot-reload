import ModulesDriver from 'HotReload/eventStream/client/ModulesDriver';
import * as errorHandler from 'RequireJsLoader/extras/errorHandler';

describe('ModulesDriver', () => {
    let driver = new ModulesDriver();
    beforeEach(() => {
        driver = new ModulesDriver();
    });
    describe('.load()', () => {
        it('should load file', () => {
            return driver.load(['HotReloadUnit/resources/testLoad']).then((testLoad) => {
                assert.equal(testLoad.length, 1);
                assert.equal(testLoad[0]._moduleName, 'HotReloadUnit/resources/testLoad');
            });
        });

        it('should throw an error', () => {
            return driver.load(['HotReloadUnit/not/existed/module']).catch((error) => {
                error;
            });
        });
    });

    describe('unload', () => {
        let stuberrorHandler;
        beforeEach(() => {
            stuberrorHandler = sinon.stub(errorHandler.undefineFailedAncestorsInner).callsFake(() => '');
        });

        it('should call errorHandler', (done) => {
            let unload = ['Test11'];
            errorHandler.callsFake((unload) => {
                asser.strictEqual(unload, unload);
                done();
            });
            driver.unload(unload);
        });

        afterEach(() => {
            stuberrorHandler.restore();
        })
    });

    describe('onModuleLoaded', () => {
        let stuberrorHandler;
        beforeEach(() => {
            stuberrorHandler = sinon.stub(errorHandler.undefineFailedAncestorsInner).callsFake(() => '');
        });

        it('should call errorHandler', (done) => {
            let unload = ['Test11'];
            errorHandler.callsFake((unload) => {
                asser.strictEqual(unload, unload);
                done();
            });
            driver.unload(unload);
        });

        afterEach(() => {
            stuberrorHandler.restore();
        })
    });
});
