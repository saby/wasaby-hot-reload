const AbstractController = require('./AbstractController');

const START_TIME = Date.now();

/**
 * Контроллер, выводящий статус сервера
 */
class StatusController extends AbstractController {
    async indexAction() {
        this.model = {
            status: 'ok',
            upTime: (Date.now() - START_TIME) / 1000
        };
    }
}

module.exports = StatusController;
