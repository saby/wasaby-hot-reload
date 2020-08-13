const AbstractController = require('./AbstractController');
const ErrorView = require('../views/ErrorView');

class ErrorController extends AbstractController {
    constructor(request, response, error) {
        super(request, response);
        this.error = error;
    }

    async handle() {
        this.model = this.error;
        this.view = new ErrorView();
        this.applyStatus();
        this.applyHeaders();
        this.sendResponse();
    }
}

module.exports = ErrorController;
