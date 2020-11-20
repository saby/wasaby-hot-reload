import {assert} from 'chai';
import getUniqueUrl from 'HotReload/eventStream/client/_getUniqueUrl';

describe('HotReload/eventStream/client/_getUniqueUrl', () => {
    it('should add hotReloadId parameter to the URL without params', () => {
        const url = getUniqueUrl('/foo/bar.js');
        assert.isTrue(url.startsWith('/foo/bar.js?&hotReloadId='));
    });

    it('should add hotReloadId parameter to the URL with params', () => {
        const url = getUniqueUrl('/foo/bar.js?param=value');
        assert.isTrue(url.startsWith('/foo/bar.js?param=value&hotReloadId='));
    });
});
