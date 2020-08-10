const JsonView = require('../views/JsonView');
const logger = require('../lib/logger');

class AbstractController {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.logger = logger;
        this.httpStatus = 200;
    }

    async handle() {
        this.model = Object.create(null);
        this.view = new JsonView();

        // TODO: detect action by request
        await this.indexAction();

        this.applyStatus();
        this.applyHeaders();
        this.sendResponse();
    }

    async indexAction() {
        throw new Error('Method must be implemented');
    }

    applyStatus() {
        this.response.statusCode = this.view.statusCode;
        this.response.statusMessage = this.view.statusMessage;
    }

    applyHeaders() {
        this.response.setHeader('Content-Type', this.view.contentType);
    }

    sendResponse() {
        this.response.end(this.view.render(this.model));
    }
}

module.exports = AbstractController;
