const AbstractView = require('./AbstractView');

/**
 * Представление данных, используемое для вывода потока серверных событий
 */
class EventStreamView extends AbstractView {
    get contentType() {
        return 'text/event-stream';
    }

    render(model) {
        return `event: ${model.event}\n` +
            `id: ${model.id}\n` +
            `data: ${JSON.stringify(model.data)}\n` +
            '\n';
    }
}

module.exports = EventStreamView;
