import global from './global';
import * as sinon from 'sinon';

export default function setUp(hostname: string): () => void {
    const fakeLocation = {
        hostname: hostname
    };

    if (!global.location) {
        global.location = {};
    }

    sinon.replace(global, 'location', fakeLocation);

    return function tearDown(): void {
        sinon.restore();
    }
}
