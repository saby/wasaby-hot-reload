const DEFAULT_PORT = 8080;
const DEFAULT_PATH = '/channel';

export interface IModulesUpdateEvent extends Event {
    data: string[];
}

export default class Connection {
    protected host: string = location.hostname;
    protected port: number = DEFAULT_PORT;
    protected path: string = DEFAULT_PATH;
    protected eventSource: EventSource;

    constructor(port?: number) {
        if (port) {
            this.port = port;
        }
    }

    connect(): void {
        if (this.eventSource) {
            throw new Error('Event source is already connected');
        }

        this.eventSource = new EventSource(`//${this.host}:${this.port}${this.path}`);
    }

    disconnect(): void {
        if (!this.eventSource) {
            throw new Error('Event source is not connected');
        }

        this.eventSource.close();
        this.eventSource = null;
    }

    on(event: string, listener: EventListenerOrEventListenerObject): void {
        if (!this.eventSource) {
            throw new Error('Event source is not connected');
        }

        this.eventSource.addEventListener(event, listener);
    }

    off(event: string, listener: EventListenerOrEventListenerObject): void {
        if (!this.eventSource) {
            throw new Error('Event source is not connected');
        }

        this.eventSource.removeEventListener(event, listener);
    }
}
