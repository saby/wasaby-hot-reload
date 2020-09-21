import {assert} from 'chai';
import setupManager, {DefaultManager} from '../../stubs/RequireJsLoader/ModulesManager';
import setupDocument from '../../stubs/document';
import setupLocation from '../../stubs/location';
import setupEventSource from '../../stubs/EventSource';

import Controller from 'HotReload/eventStream/client/Controller';

describe('HotReload/eventStream/client/Controller', () => {
    let restoreManager: () => void;
    let restoreDocument: () => void;
    let restoreLocation: () => void;
    let restoreEventSource: () => void;

    beforeEach(() => {
        restoreManager = setupManager();
        restoreDocument = setupDocument();
        restoreLocation = setupLocation('foo.bar');
        restoreEventSource = setupEventSource();
    });

    afterEach(() => {
        restoreManager();
        restoreDocument();
        restoreLocation();
        restoreEventSource();
    });

    describe('.getModulesManager()', () => {
        it('should return default manager', async () => {
            const controller = new Controller();
            const manager = await controller.getModulesManager();
            assert.instanceOf(manager, DefaultManager);
        });

        it('should return injected manager', async () => {
            class InjectedManager {}
            const restoreInjectedManager = setupManager('Foo/Bar/Manager', InjectedManager);
            const controller = new Controller('Foo/Bar/Manager');
            const manager = await controller.getModulesManager();
            restoreInjectedManager();

            assert.instanceOf(manager, InjectedManager);
        });
    });

    describe('.run()', () => {
        it('should go withoud crashing', async () => {
            const controller = new Controller();
            await controller.run();
        });
    });
});
