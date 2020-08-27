import {assert} from 'chai';

import ModulesUpdater from 'HotReload/eventStream/client/ModulesUpdater';
import FakeDriver from '../../mocks/ModulesDriver';

describe('HotReload/eventStream/client/ModulesUpdater', () => {
    describe('.update()', () => {
        it('should unload modules via driver', async () => {
            const driver = new FakeDriver();
            const updater = new ModulesUpdater(driver);

            await updater.update(['foo']);
            assert.deepEqual(FakeDriver.lastUnloaded, ['foo']);
        });

        it('should load modules via driver', async () => {
            const driver = new FakeDriver();
            const updater = new ModulesUpdater(driver);

            await updater.update(['bar']);
            assert.deepEqual(FakeDriver.lastLoaded, ['bar']);
        });
    });
});
