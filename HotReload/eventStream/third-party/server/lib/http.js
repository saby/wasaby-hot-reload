/**
 * Возвращает тело POST запроса
 * @param {*} request HTTP запрос
 */
async function getPostRequestData(request) {
    return new Promise((resolve, reject) => {
        if (request.method !== 'POST') {
            reject(new TypeError('This is not a POST request'));
        }
    
        var body = '';
    
        request.on('data', (data) => {
            body += data;
        });
    
        request.on('end', () => {
            resolve(body);
        });

        request.on('abort', () => {
            reject(new Error('Request aborted'));
        });

        request.on('timeout', () => {
            reject(new Error('Request timeout'));
        });
    });
}

exports.getPostRequestData = getPostRequestData;
