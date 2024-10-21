import { IConnection } from 'HotReload/eventStream/client/_Connection';

export default class Connection implements IConnection {
    constructor(public host: string = '', public port: number = -1) {
        lastInstance = this;
    }

    connect(): void {
        // Dummy
    }

    disconnect(): void {
        // Dummy
    }

    on(event: string, listener: EventListenerOrEventListenerObject): void {
        // Dummy
    }

    off(event: string, listener: EventListenerOrEventListenerObject): void {
        // Dummy
    }
}

let lastInstance: Connection;

export function getLastInstance(): Connection {
    return lastInstance;
}
