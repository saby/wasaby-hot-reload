const StatusController = require('./controllers/StatusController');
const EventStreamController = require('./controllers/EventStreamController');
const PushController = require('./controllers/PushController');
const NotFoundController = require('./controllers/NotFoundController');

class Router {
    getController(request, response) {
        const url = new URL(request.url, `http://${request.headers.host}`);

        switch (url.pathname) {
            case '/':
                return new StatusController(request, response);
            case '/channel':
                return new EventStreamController(request, response);
            case '/push':
                return new PushController(request, response);
            default:
                return new NotFoundController(request, response, url.pathname);
        }
    }
}

module.exports = {Router};
