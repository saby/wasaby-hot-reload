const AbstractController = require('./AbstractController');
const {getPostRequestData} = require('../lib/http');
const {events} = require('../storage');

let totalCount = 0;

/**
 * Контроллер, добавляющие данные об измененных модулях в разделяемое хранилище
 */
class PushController extends AbstractController {
    async indexAction() {
        const data = await getPostRequestData(this.request);
        const event = JSON.parse(data);

        if (!event.event) {
            throw new ReferenceError('Field "event" is not defined.');
        }
        if (!event.data) {
            throw new ReferenceError('Field "data" is not defined.');
        }

        event.timestamp = Date.now();
        event.id = ++totalCount;
        events.push(event);

        this.model = {
            status: 'success',
            eventId: event.id,
            queue: events.length
        };
    }
}

module.exports = PushController;
