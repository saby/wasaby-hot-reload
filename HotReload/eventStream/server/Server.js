const http = require('http');
const ErrorController = require('./controllers/ErrorController');
const logger = require('./lib/logger');

const STATES = {
    STOPPED: 0,
    STARTED: 1
};

class Server {
    constructor(port, router) {
        this.port = port;
        this.signature = `Wasaby hot reload server on port ${port}.`;
        this.state = STATES.STOPPED;
        this.router = router;
        this.start();
    }

    onError(request, response, err) {
        logger.error(err);
        const errController = new ErrorController(request, response, err);
        errController.handle().catch(logger.error);
    }

    start() {
        if (this.state === STATES.STARTED) {
            throw new Error('Server is already started.');
        }

        logger.log(`Starting ${this.signature}`);

        this.process = http.createServer((request, response) => {
            try {
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

    stop() {
        return new Promise((resolve, reject) => {
            if (this.state === STATES.STOPPED) {
                throw new Error('Server is already stopped.');
            }
    
            logger.log(`Stopping ${this.signature}`);
            this.process.close((err) => {
                if (err) {
                    reject(err);
                }
                this.state = STATES.STOPPED;
                resolve();
            });
        });
    }
}

module.exports = {Server, STATES};
