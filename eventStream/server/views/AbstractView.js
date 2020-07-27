class AbstractView {
    get statusCode() {
        return 200;
    }

    get statusMessage() {
        return 'OK';
    }

    get contentType() {
        return 'text/plain';
    }

    render(model) {
        throw new Error('Method must be implemented');
    }
}

module.exports = AbstractView;
