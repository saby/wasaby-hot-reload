import {assert} from 'chai';
import setupDriver, {DefaultDriver} from '../../stubs/RequireJsLoader/Driver';
import setupDocument from '../../stubs/document';
import setupLocation from '../../stubs/location';
import setupEventSource from '../../stubs/EventSource';

import Controller from 'HotReload/eventStream/client/Controller';

describe('HotReload/eventStream/client/Controller', () => {
    let restoreDriver: () => void;
    let restoreDocument: () => void;
    let restoreLocation: () => void;
    let restoreEventSource: () => void;

    beforeEach(() => {
        restoreDriver = setupDriver();
        restoreDocument = setupDocument();
        restoreLocation = setupLocation('foo.bar');
        restoreEventSource = setupEventSource();
    });

    afterEach(() => {
        restoreDriver();
        restoreDocument();
        restoreLocation();
        restoreEventSource();
    });

    describe('.getModulesManager()', () => {
        it('should return default driver', async () => {
            const controller = new Controller();
            const driver = await controller.getModulesManager();
            assert.instanceOf(driver, DefaultDriver);
        });

        it('should return injected driver', async () => {
            class InjectedDriver {}
            const restoreInjectedDriver = setupDriver('Foo/Bar/Driver', InjectedDriver);
            const controller = new Controller('Foo/Bar/Driver');
            const driver = await controller.getModulesManager();
            restoreInjectedDriver();

            assert.instanceOf(driver, InjectedDriver);
        });
    });

    describe('.run()', () => {
        it('should go withoud crashing', async () => {
            const controller = new Controller();
            await controller.run();
        });
    });
});
