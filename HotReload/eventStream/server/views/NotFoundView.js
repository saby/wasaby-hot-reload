const AbstractView = require('./AbstractView');

class NotFoundView extends AbstractView {
    get statusCode() {
        return 404;
    }

    get statusMessage() {
        return 'Not found';
    }

    render(err) {
        return err.message;
    }
}

module.exports = NotFoundView;
