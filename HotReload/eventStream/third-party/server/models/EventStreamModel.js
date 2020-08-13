let messagesCounter = 0;

function getMessageId() {
    return messagesCounter++;
}

class EventStreamModel {
    constructor({event = '', data = {}, id = getMessageId()}) {
        this.id = id;
        this.event = event;
        this.data = data;
    }
}

module.exports = EventStreamModel;
