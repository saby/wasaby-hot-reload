const AbstractView = require('./AbstractView');

/**
 * Представление данных, используемое для вывода данных в формате JSON
 */
class JsonView extends AbstractView {
    get contentType() {
        return 'application/json';
    }

    render(model) {
        return JSON.stringify(model);
    }
}

module.exports = JsonView;
