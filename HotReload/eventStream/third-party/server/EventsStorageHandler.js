const EventStreamModel = require('./models/EventStreamModel');
const {events} = require('./storage');

const STORAGE_CHECK_INTERVAL = 500;

class EventsStorageHandler {
    constructor() {
        this.controllers = new Set();

        const int = setInterval(this.checkStorage.bind(this), STORAGE_CHECK_INTERVAL);
        // TODO: It would be better to use clearInterval(int) when no one listening;
    }

    register(controller) {
        this.controllers.add(controller);
    }

    unregister(controller) {
        this.controllers.remove(controller);
    }

    checkStorage() {
        if (this.controllers.size === 0 || events.length === 0) {
            return;
        }

        this.controllers.forEach((controller) => {
            if (controller.request.destroyed) {
                this.controllers.remove(controller);
                return;
            }

            events.forEach((event) => {
                controller.updateModel(new EventStreamModel(event));
            });
        });

        events.length = 0;
    }
}

module.exports = EventsStorageHandler;
