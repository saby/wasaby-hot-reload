const AbstractController = require('./AbstractController');
const NotFoundView = require('../views/NotFoundView');

class NotFoundController extends AbstractController {
    constructor(request, response, path) {
        super(request, response);
        this.path = path;
    }

    async indexAction() {
        this.model = new ReferenceError(`Path "${this.path}" is not found.`);
        this.view = new NotFoundView();
    }

}

module.exports = NotFoundController;
