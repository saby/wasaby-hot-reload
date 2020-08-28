import {assert} from 'chai';

import ModulesUpdater from 'HotReload/eventStream/client/ModulesUpdater';
import FakeManager from '../../mocks/ModulesManager';

describe('HotReload/eventStream/client/ModulesUpdater', () => {
    describe('.update()', () => {
        it('should unload modules using manager', async () => {
            const manager = new FakeManager();
            const updater = new ModulesUpdater(manager);

            await updater.update(['foo']);
            assert.deepEqual(FakeManager.lastUnloaded, ['foo']);
        });

        it('should load modules using manager', async () => {
            const manager = new FakeManager();
            const updater = new ModulesUpdater(manager);

            await updater.update(['bar']);
            assert.deepEqual(FakeManager.lastLoaded, ['bar']);
        });
    });
});
