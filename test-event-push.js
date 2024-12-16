const https = require('http');

function httpPost({body, ...options}) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: 'POST',
            ...options,
        }, (res) => {
            res.on('data', (data) => process.stdout.write(data))
            res.on('end', resolve);
        })
        req.on('error', reject);

        if (body) {
            req.write(body);
        }
        req.end();
    })
}

httpPost({
    hostname: '127.0.0.1',
    port: 8080,
    path: `/push`,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        event: 'modules-changed',
        data: [
            'ModuleA/file/nameB',
            'plugin!ModuleC/file/nameD',
            new Date()
        ]
    })
}).catch(console.error);
