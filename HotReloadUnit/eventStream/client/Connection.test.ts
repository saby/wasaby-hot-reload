import {assert} from 'chai';
import setupLocation from '../../stubs/location';
import setupEventSource from '../../stubs/EventSource';
import {
    getLastInstance as getLastEventSourceInstance,
    getLastAddedEventListener as getLastAddedEventSourceListener,
    getLastRemovedEventListener as getLastRemovedEventSourceListener,
    State as EventSourceState
} from '../../mocks/EventSource';

import Connection from 'HotReload/eventStream/client/_Connection';

describe('HotReload/eventStream/client/_Connection', () => {
    let restoreLocation: () => void;
    let restoreEventSource: () => void;

    beforeEach(() => {
        restoreLocation = setupLocation('foo.bar');
        restoreEventSource = setupEventSource();
    });

    afterEach(() => {
        restoreLocation();
        restoreEventSource();
    });

    describe('.connect()', () => {
        it('should create eventSource on default URL', () => {
            const controller = new Connection();
            controller.connect();

            const lastEventSource = getLastEventSourceInstance();
            assert.equal(lastEventSource.url, 'http://foo.bar:8080/channel');
        });

        it('should create eventSource on custom host', () => {
            const host = 'foo';
            const controller = new Connection(host);
            controller.connect();

            const lastEventSource = getLastEventSourceInstance();
            assert.equal(lastEventSource.url, 'http://foo:8080/channel');
        });

        it('should create eventSource on custom port', () => {
            const port = 123;
            const controller = new Connection('', port);
            controller.connect();

            const lastEventSource = getLastEventSourceInstance();
            assert.equal(lastEventSource.url, 'http://:123/channel');
        });

        it('should throw an error if already connected', () => {
            const controller = new Connection();
            controller.connect();

            assert.throws(() => {
                controller.connect();
            }, 'Event source is already connected');
        });
    });

    describe('.disconnect()', () => {
        it('should throw an error if not connected', () => {
            const controller = new Connection();

            assert.throws(() => {
                controller.disconnect();
            }, 'Event source is not connected');
        });

        it('should close eventSource', () => {
            const controller = new Connection();
            controller.connect();
            controller.disconnect();

            const lastEventSource = getLastEventSourceInstance();
            assert.strictEqual(lastEventSource.readyState, EventSourceState.Closed);
        });
    });

    describe('.on()', () => {
        it('should throw an error if not connected', () => {
            const controller = new Connection();

            assert.throws(() => {
                controller.on('message', () => null);
            }, 'Event source is not connected');
        });

        it('should add an event listener to the eventSource', () => {
            const controller = new Connection();
            controller.connect();

            const listener = () => null;
            controller.on('message', listener);

            const lastListener = getLastAddedEventSourceListener();
            assert.strictEqual(lastListener.event, 'message');
            assert.strictEqual(lastListener.listener, listener);
        });
    });

    describe('.off()', () => {
        it('should throw an error if not connected', () => {
            const controller = new Connection();

            assert.throws(() => {
                controller.off('message', () => null);
            }, 'Event source is not connected');
        });

        it('should remove an event listener from the eventSource', () => {
            const controller = new Connection();
            controller.connect();

            const listener = () => null;
            controller.off('message', listener);

            const lastListener = getLastRemovedEventSourceListener();
            assert.strictEqual(lastListener.event, 'message');
            assert.strictEqual(lastListener.listener, listener);
        });
    });
});
