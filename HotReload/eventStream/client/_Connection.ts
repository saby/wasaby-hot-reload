const DEFAULT_PORT = 8080;
const DEFAULT_PATH = '/channel';

export interface IModulesUpdateEvent extends Event {
    data: string;
}

export interface IConnection {
    /**
     * Устанавливает соединение с каналом серверных событий
     */
    connect(): void;

    /**
     * Разрывает соединение с каналом серверных событий
     */
    disconnect(): void;

    /**
     * Добавляет подписку на сервеное событие
     * @param event Имя события
     * @param listener Обработчик события
     */
    on(event: string, listener: EventListenerOrEventListenerObject): void;

    /**
     * Удаляет подписку на серверное событие
     * @param event Имя события
     * @param listener Обработчик события
     */
    off(event: string, listener: EventListenerOrEventListenerObject): void;

}

export type ConnectionConstructor = new(host: string, port: number) => IConnection;

/**
 * Класс, устанавливающий соединение с каналом серверных событий, и принимающий события об обновлении модулей приложения.
 * Под капотом используется {@link https://developer.mozilla.org/en-US/docs/Web/API/EventSource EventSource API}.
 */
export default class Connection implements IConnection {
    /**
     * Путь на хосте
     */
    protected path: string = DEFAULT_PATH;

    /**
     * Инстанс EventSource, обслуживающий соединение
     */
    protected eventSource: EventSource;

    /**
     *  Конструктор класса
     * @param port Имя хоста для соединения, по умолчанию текущий хост
     * @param port Порт, на котором происходит соединение с каналом серверных событий
     */
    constructor(
        protected host: string = location.hostname,
        protected port: number = DEFAULT_PORT) {
    }

    connect(): void {
        if (this.eventSource) {
            throw new Error('Event source is already connected');
        }

        this.eventSource = new EventSource(`http://${this.host}:${this.port}${this.path}`);
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
