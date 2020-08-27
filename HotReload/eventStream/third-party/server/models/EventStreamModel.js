let messagesCounter = 0;

/**
 * Возвращает уникальный идентификатор серверного события
 */
function getMessageId() {
    return messagesCounter++;
}

/**
 * Модель {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events SSE события}.
 */
class EventStreamModel {
    /**
     * Конструктор модели
     * @param {*} options Опции конструктора
     * @param {string} options.event Название события
     * @param {object} options.data Данные события
     * @param {string} options.id Идентификатор события
     */
    constructor({event = '', data = {}, id = getMessageId()}) {
        this.id = id;
        this.event = event;
        this.data = data;
    }
}

module.exports = EventStreamModel;
