import {assert} from 'chai';
import * as sinon from 'sinon';
import FakeConnection, { getLastInstance as getLastConnectionInstance } from '../../mocks/Connection';
import setupManager, { DefaultManager } from '../../stubs/RequireJsLoader/conduct';
import setupDocument from '../../stubs/document';
import setupLocation from '../../stubs/location';
import setupEventSource from '../../stubs/EventSource';

import Controller from 'HotReload/eventStream/client/_Controller';

describe('HotReload/eventStream/client/_Controller', () => {
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
            const managerName = 'Foo/Bar/Manager';
            const restoreInjectedManager = setupManager(managerName, InjectedManager);
            const controller = new Controller({managerName});
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

        it('should call modules manager if config.staticServer is defined', async () => {
            const InjectedManager = sinon.spy(DefaultManager as unknown as () => void);
            const config = {staticServer: '1234'};
            const managerName = 'Foo/Bar/Manager';
            const restoreInjectedManager = setupManager(managerName, InjectedManager);

            const controller = new Controller({config, managerName});
            await controller.run();

            restoreInjectedManager();

            assert.isTrue(InjectedManager.called);
        });

        it('should create connection on host and port from config.staticServer', async () => {
            const config = {staticServer: 'foo:1234'};
            const controller = new Controller({
                config,
                connectionConstructor: FakeConnection
            });
            await controller.run();

            const lastConnection = getLastConnectionInstance();
            assert.equal(lastConnection.host, 'foo');
            assert.equal(lastConnection.port, 1234);
        });
    });
});
