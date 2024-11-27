/**
 * Перевращает массив аргументов командной строки hash map.
 * 
 * @param {*} argv Аргументы командной строки вида ['name1=value1', 'name2=value2', ...]
 */
function toObject(argv) {
    return argv.reduce((memo, item) => {
        const [key, value] = item.split('=');
        memo[key || value] = value;

        return memo;
    }, {});
}

exports.toObject = toObject;
