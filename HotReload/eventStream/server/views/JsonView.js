const AbstractView = require('./AbstractView');

class JsonView extends AbstractView {
    get contentType() {
        return 'application/json';
    }

    render(model) {
        return JSON.stringify(model);
    }
}

module.exports = JsonView;
