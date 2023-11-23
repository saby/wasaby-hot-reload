const EventStreamModel = require('./models/EventStreamModel');
const {events} = require('./storage');

const STORAGE_CHECK_INTERVAL = 500;

/**
 * Класс для обработки потока событий и помещения его в разделяемое хранилище
 */
class EventsStorageHandler {
    constructor() {
        this.controllers = new Set();

        const int = setInterval(this.checkStorage.bind(this), STORAGE_CHECK_INTERVAL);
        // TODO: It would be better to use clearInterval(int) when no one listening;
    }

    /**
     * Регистрирует контроллер, обрабатывающий поток событий
     * @param {EventStreamController} controller
     */
    register(controller) {
        this.controllers.add(controller);
    }

    /**
     * Разрегистрирует контроллер, обрабатывающий поток событий
     * @param {EventStreamController} controller
     */
    unregister(controller) {
        this.controllers.delete(controller);
    }

    /**
     * Проверяет хранилище на предмет новых событий.
     * При наличии новых событий рассылает их по контроллерам.
     * @param {EventStreamController} controller
     */
    checkStorage() {
        if (this.controllers.size === 0 || events.length === 0) {
            return;
        }

        this.controllers.forEach((controller) => {
            if (controller.request.destroyed) {
                this.controllers.delete(controller);
                return;
            }

            events.forEach((event) => {
                // Don't notify controllers started after event being received
                if (event.timestamp && controller.startTime > event.timestamp) {
                    return;
                }

                controller.updateModel(new EventStreamModel(event));
            });
        });

        events.length = 0;
    }
}

module.exports = EventsStorageHandler;
