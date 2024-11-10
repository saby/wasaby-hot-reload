import * as sinon from 'sinon';
import global from './global';
import FakeDocument from '../mocks/Document';

export default function setUp(): () => void {
    const fakeDocument = new FakeDocument();

    if (!global.document) {
        global.document = {};
    }

    sinon.replace(global, 'document', fakeDocument);

    return function tearDown(): void {
        sinon.restore();
    }
}
