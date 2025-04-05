const AbstractController = require('./AbstractController');
const EventStreamView = require('../views/EventStreamView');
const EventStreamModel = require('../models/EventStreamModel');
const EventsStorageHandler = require('../EventsStorageHandler');

// Timeout to keep request alive (0 means forever)
const REQUEST_TIMEOUT = 0;

let handler;

/**
 * Контроллер, обслуживающий {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events SSE} соединение.
 * Особенность в том, что он не разрывает соединение, а отсылает данные в канал, пока соединение не будет разорвано с клиентской стороны.
 */
class EventStreamController extends AbstractController {
    constructor(request, response) {
        super(request, response);
        this.startTime = Date.now();
    }

    sendResponse() {
        this.response.write(this.view.render(this.model));
    }

    async indexAction() {
        if (!handler) {
            handler = new EventsStorageHandler();
        }
        handler.register(this);

        this.request.setTimeout(REQUEST_TIMEOUT);

        this.model = new EventStreamModel({
            data: {message: 'Welcome to the hot reload event stream'},
            event: 'greeting'
        });
        this.view = new EventStreamView(this.response);

        this.request.on('abort', () => {
            handler.unregister(this);
        });
    }

    /**
     * Обновляет содержимое модели и отправляет ее на клиент
     * @param {*} model Обновленная модель
     */
    updateModel(model) {
        this.model = model;
        this.sendResponse();
    }
}

module.exports = EventStreamController;
