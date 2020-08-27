import {assert} from 'chai';

import ModulesUpdater from 'HotReload/eventStream/client/ModulesUpdater';
import FakeDriver from '../../mocks/ModulesDriver';

describe('HotReload/eventStream/client/ModulesUpdater', () => {
    describe('.reset()', () => {
        it('should unload modules via driver', async () => {
            const driver = new FakeDriver();
            const controller = new ModulesUpdater(driver);

            await controller.reset(['foo']);
            assert.deepEqual(FakeDriver.lastUnloaded, ['foo']);
        });

        it('should load modules via driver', async () => {
            const driver = new FakeDriver();
            const controller = new ModulesUpdater(driver);

            await controller.reset(['bar']);
            assert.deepEqual(FakeDriver.lastLoaded, ['bar']);
        });
    });
});
