/**
 * Абстрактное представление данных
 */
class AbstractView {
    /**
     * HTTP статус представления
     */
    get statusCode() {
        return 200;
    }

    /**
     * Текстовое сообщения HTTP статуса
     */
    get statusMessage() {
        return 'OK';
    }

    /**
     * Тип содержимого представления
     */
    get contentType() {
        return 'text/plain';
    }

    /**
     * Возвращает текстовое представление модели, используемое в данном представлении
     * @param {*} model Модель для преобразования в текст
     */
    render(model) {
        throw new Error('Method must be implemented');
    }
}

module.exports = AbstractView;
