const http = require('http');
const ErrorController = require('./controllers/ErrorController');
const logger = require('./lib/logger');

const STATES = {
    STOPPED: 0,
    STARTED: 1
};

/**
 * HTTP сервер для обслуживания hot reload
 */
class Server {
    /**
     * Конструктор
     * @param {number} port Номер порта для подключения клиентов
     * @param {Router} router Роутер
     */
    constructor(port, router) {
        this.port = port;
        this.signature = `Wasaby event stream server on port ${port}.`;
        this.state = STATES.STOPPED;
        this.router = router;
        this.start();
    }

    /**
     * Обработчик ошибок
     * @param {*} request Запрос
     * @param {*} response Ответ
     * @param {Error} err Ошибка
     */
    onError(request, response, err) {
        logger.error(err);
        const errController = new ErrorController(request, response, err);
        errController.handle().catch(logger.error);
    }

    /**
     * Запускает сервер
     */
    start() {
        if (this.state === STATES.STARTED) {
            throw new Error('Server is already started.');
        }

        logger.log(`Starting ${this.signature}`);

        this.process = http.createServer((request, response) => {
            try {
                //Add headers for CORS
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Credentials', 'true');

                this.router.getController(request, response).handle().catch((err) => {
                    this.onError(request, response, err);
                });
            } catch (err) {
                this.onError(request, response, err);
            }
        }).on('clientError', (err, socket) => {
           socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        }).listen(this.port);

        this.state = STATES.STARTED;
    }

    /**
     * Останавливает сервер
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (this.state === STATES.STOPPED) {
                reject(new Error('Server is already stopped.'));
            }

            this.state = STATES.STOPPED;
            logger.log(`Stopping ${this.signature}`);
            this.process.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(this.state);
            });
        });
    }
}

module.exports = {Server, STATES};
