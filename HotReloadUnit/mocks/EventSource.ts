let lastInstance: EventSource;
let lastAddedEventListener: {event: string, listener: Function};
let lastRemovedEventListener: {event: string, listener: Function};

export enum State {Connecting, Open, Closed}

export function getLastInstance(): EventSource {
    return lastInstance;
}

export function getLastAddedEventListener(): typeof lastAddedEventListener {
    return lastAddedEventListener;
}

export function getLastRemovedEventListener(): typeof lastAddedEventListener {
    return lastRemovedEventListener;
}

export default class EventSource {
    readyState: State = State.Connecting;

    constructor(public url: string) {
        lastInstance = this;
    }

    close(): void {
        this.readyState = State.Closed;
    }

    addEventListener(event: string, listener: Function): void {
        lastAddedEventListener = {event, listener};
    }

    removeEventListener(event: string, listener: Function): void {
        lastRemovedEventListener = {event, listener};
    }
}
