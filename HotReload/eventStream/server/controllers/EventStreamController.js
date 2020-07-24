const AbstractController = require('./AbstractController');
const EventStreamView = require('../views/EventStreamView');
const EventStreamModel = require('../models/EventStreamModel');
const EventsStorageHandler = require('../EventsStorageHandler');

let handler;

class EventStreamController extends AbstractController {
    sendResponse() {
        this.response.write(this.view.render(this.model));
    }

    async indexAction() {
        if (!handler) {
            handler = new EventsStorageHandler();
        }
        handler.register(this);

        this.model = new EventStreamModel({
            data: {message: 'Welcome to the hot reload event stream'},
            event: 'startup'
        });
        this.view = new EventStreamView(this.response);

        this.request.on('abort', () => {
            handler.unregister(this);
        });
    }

    updateModel(model) {
        this.model = model;
        this.sendResponse();
    }
}

module.exports = EventStreamController;
