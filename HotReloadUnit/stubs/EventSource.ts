import global from './global';
import EventSource from '../mocks/EventSource';

export default function setUp(): () => void {
    const OriginalEventSource = global.EventSource;
    global.EventSource = EventSource;

    return function tearDown(): void {
        global.EventSource = OriginalEventSource;
    }
}
