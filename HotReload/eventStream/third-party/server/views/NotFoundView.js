const AbstractView = require('./AbstractView');

/**
 * Представление данных, используемое для вывода ошибки о том, что ресурс не найден на сервере
 */
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
