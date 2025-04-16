import {assert} from 'chai';

import ComponentsUpdater from 'HotReload/eventStream/client/_ComponentsUpdater';
import FakeDocumnet from '../../mocks/Document';
import Control from '../../mocks/Control';

describe('HotReload/eventStream/client/_ComponentsUpdater', () => {
    describe('.update()', () => {
        it('should update components started from given root', () => {
            const document = new FakeDocumnet();
            const updater = new ComponentsUpdater(document as unknown as Document);

            const controlA = new Control();
            const controlB = new Control();
            document.controlNodes = [{
                control: controlA
            }];
            (document as any).children = [{
                controlNodes: [{
                    control: controlB
                }],
                children: []
            }];

            assert.isFalse(controlA.forceUpdated);
            assert.isFalse(controlB.forceUpdated);

            updater.update([]);

            assert.isTrue(controlA.forceUpdated);
            assert.isTrue(controlB.forceUpdated);
        });
    });
});
