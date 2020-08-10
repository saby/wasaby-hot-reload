function toObject(argv) {
    return argv.reduce((memo, item) => {
        const [key, value] = item.split('=');
        memo[key || value] = value;

        return memo;
    }, {});
}

exports.toObject = toObject;