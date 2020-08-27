const JsonView = require('../views/JsonView');
const logger = require('../lib/logger');

/**
 * Абстрактный контроллер серверного приложения
 */
class AbstractController {
    /**
     * Конструктор контроллера
     * @param {*} request HTTP запрос
     * @param {*} response Ответ на HTTP запрос
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.logger = logger;
        this.httpStatus = 200;
    }

    /**
     * Запускает процесс обработки HTTP запроса
     */
    async handle() {
        this.model = Object.create(null);
        this.view = new JsonView();

        // TODO: detect action by request
        await this.indexAction();

        this.applyStatus();
        this.applyHeaders();
        this.sendResponse();
    }

    /**
     * Обработчик запроса по умолчанию
     */
    async indexAction() {
        throw new Error('Method must be implemented');
    }

    /**
     * Применяет статус представления к ответу на запрос
     */
    applyStatus() {
        this.response.statusCode = this.view.statusCode;
        this.response.statusMessage = this.view.statusMessage;
    }

    /**
     * Применяет тип содержимого представления к ответу на запрос
     */
    applyHeaders() {
        this.response.setHeader('Content-Type', this.view.contentType);
    }

    /**
     * Отправляет тело ответа на запрос
     */
    sendResponse() {
        this.response.end(this.view.render(this.model));
    }
}

module.exports = AbstractController;
