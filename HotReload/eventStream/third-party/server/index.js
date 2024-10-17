/**
 * Runs event stream HTTP server to process requests.
 *
 * Arguments:
 * [--port] run on given port
 *
 * RESTful API URLs:
 * - "/": displays server status
 * - "/channel": the event stream channel to use with {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events EventSource} class.
 * - "/push": [POST] push events to the channel. Data signature:
 * interface IPushBody {
 *    event: string,
 *    data: object
 * }
 *
 * Browser connection example:
 * const channel = new EventSource('/channel');
 * channel.addEventListener('modules-changed', (event) => {
 *   console.log('EventSource event:', event);
 * });
 * channel.onerror = (err) => {
 *   console.error('EventSource error:', err);
 * };
 */

const {Server, STATES} = require('./Server');
const {Router} = require('./Router');
const {toObject} = require('./lib/argv');

const DEFAULT_PORT = 8080;
const args = toObject(process.argv);

const router = new Router();
const server = new Server(args['--port'] || DEFAULT_PORT, router);

process.on('exit', (code) => {
    if (code === 0 && server.state === STATES.STARTED) {
        server.stop();
    }
});

process.on('SIGINT', () => {
    server.stop();
    process.kill(process.pid, 'SIGINT');
});
