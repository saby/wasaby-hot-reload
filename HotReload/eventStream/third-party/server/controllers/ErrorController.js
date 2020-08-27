const AbstractController = require('./AbstractController');
const ErrorView = require('../views/ErrorView');

/**
 * Контроллер, выводящий ошибку сервера
 */
class ErrorController extends AbstractController {
    /**
     * Конструктор контроллера ошибки
     * @param {*} request HTTP запрос
     * @param {*} response Ответ на HTTP запрос
     * @param {Error} error Обрабатываемая ошибка
     */
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
