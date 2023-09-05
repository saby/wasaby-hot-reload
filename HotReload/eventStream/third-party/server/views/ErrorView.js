const AbstractView = require('./AbstractView');

/**
 * Представление данных, используемое для вывода ошибок сервера
 */
class ErrorView extends AbstractView {
    get statusCode() {
        return 500;
    }

    get statusMessage() {
        return 'Internal server error';
    }

    render(err) {
        return err.message;
    }
}

module.exports = ErrorView;
