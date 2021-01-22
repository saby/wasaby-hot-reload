import {assert} from 'chai';
import * as sinon from 'sinon';

import {getThemeController} from "../../mocks/ThemeController";
import ModulesUpdater, {
    getModuleName,
    isArtifact,
    eachWrappable,
    CallableCallback,
    ModuleRouter,
    setToRegistry,
    superglobal
} from 'HotReload/eventStream/client/_ModulesUpdater';
import FakeManager from '../../mocks/ModulesManager';

describe('HotReload/eventStream/client/_ModulesUpdater', () => {
    describe('getModuleName()', () => {
        it('should return empty string', () => {
            assert.equal(getModuleName(''), '');
        });

        it('should return valid string for .js', () => {
            assert.equal(getModuleName('foo/bar.js'), 'foo/bar');
        });

        it('should return valid string for .wml', () => {
            assert.equal(getModuleName('foo/bar.wml'), 'wml!foo/bar');
        });
    });

    describe('isArtifact()', () => {
        it('should return true for empty string', () => {
            assert.isTrue(isArtifact(''));
        });

        it('should return false for compilable files', () => {
            assert.isFalse(isArtifact('foo/bar.ts'));
            assert.isFalse(isArtifact('foo/bar.less'));
        });

        it('should return true for not compilable files', () => {
            assert.isTrue(isArtifact('foo/bar.js'));
            assert.isTrue(isArtifact('foo/bar.css'));
        });
    });

    describe('eachWrappable()', () => {
        interface IHandlerResult {
            scope: object;
            key: string;
            value: Function;
            path: string[];
        }

        interface IHandler {
            callback: CallableCallback;
            result: IHandlerResult[];
        }

        function getHandler(): IHandler {
            const result: IHandlerResult[] = [];
            return {
                callback(scope: object, key: string, value: Function, path: string[], isPropertySealed?: boolean): void {
                    if (!isPropertySealed) {
                        result.push({scope, key, value, path});
                    }
                },
                get result(): IHandlerResult[] {
                    return result;
                }
            };
        }

        it('should return an empty array', () => {
            const handler = getHandler();
            eachWrappable({}, handler.callback);
            assert.deepEqual(handler.result, []);
        });

        it('should skip global root', () => {
            const handler = getHandler();
            eachWrappable({superglobal}, handler.callback);
            assert.deepEqual(handler.result, []);
        });

        it('should deal with node repeats', () => {
            const nodeA = {nodeC: null};
            const nodeB = {nodeA};
            const nodeC = {nodeB};
            nodeA.nodeC = nodeC;

            const handler = getHandler();
            eachWrappable(nodeA, handler.callback);
            assert.deepEqual(handler.result, []);
        });

        it('should return each function', () => {
            const obj = {
                foo: {
                    bar(): void {/**/}
                },
                baz(): void {/**/}
            };

            const handler = getHandler();
            eachWrappable(obj, handler.callback);
            assert.deepEqual(handler.result, [{
                scope: obj.foo,
                key: 'bar',
                value: obj.foo.bar,
                path: ['foo', 'bar']
            }, {
                scope: obj,
                key: 'baz',
                value: obj.baz,
                path: ['baz']
            }]);
        });

        it('should not return any sealed properties of function', () => {
            const obj = {
                foo: {
                    bar(): void {/**/}
                },
                baz(): void {/**/}
            };

            // set sealed non-configurable property
            Object.defineProperty(obj, 'sealedFoo', {
                value: (): void => {/**/}
            });

            const handler = getHandler();
            eachWrappable(obj, handler.callback);
            assert.deepEqual(handler.result, [{
                scope: obj.foo,
                key: 'bar',
                value: obj.foo.bar,
                path: ['foo', 'bar']
            }, {
                scope: obj,
                key: 'baz',
                value: obj.baz,
                path: ['baz']
            }]);
        });

        it('should return a class and each method of it', () => {
            class Foo {
                bar(): void {/**/}
                baz(): void {/**/}
            }

            const obj = {Foo};

            const handler = getHandler();
            eachWrappable(obj, handler.callback);
            assert.deepEqual(handler.result, [{
                scope: obj.Foo.prototype,
                key: 'bar',
                value: obj.Foo.prototype.bar,
                path: ['Foo', 'prototype', 'bar']
            }, {
                scope: obj.Foo.prototype,
                key: 'baz',
                value: obj.Foo.prototype.baz,
                path: ['Foo', 'prototype', 'baz']
            }, {
                scope: obj,
                key: 'Foo',
                value: obj.Foo,
                path: ['Foo']
            }]);
        });
    });

    describe('setToRegistry()', () => {
        it('should add new entry', () => {
            const registry = new Map();
            const target = {};
            const key = 'foo';

            const result = setToRegistry(registry, key, target);

            assert.isTrue(registry.has(key));
            assert.equal(registry.get(key), result);

            assert.equal(result.key, key);
            assert.equal(result.target, target);
        });

        it('should update old entry', () => {
            const registry = new Map();
            const oldTarget = {};
            const key = 'foo';

            const entry = new ModuleRouter(oldTarget, key);
            registry.set(key, entry);

            const newTarget = {};
            const result = setToRegistry(registry, key, newTarget);

            assert.equal(result, entry);
            assert.equal(registry.get(key), entry);

            assert.equal(entry.key, key);
            assert.equal(entry.target, newTarget);
        });
    });

    describe('ModuleRouter', () => {
        describe('.constructor()', () => {
            it('should create a wrapper for function', () => {
                const target = (foo, bar) => foo + bar;
                const key = 'foo+bar';
                const entry = new ModuleRouter(target, key);

                assert.equal(entry.target, target);
                assert.equal(entry.key, key);
                assert.equal(entry.facade(1, 2), 3);
            });

            it('should create a wrapper for class', () => {
                class Foo {
                    constructor(public bar: number, public baz: number) {}
                }

                const key = 'ClassFoo';
                const entry = new ModuleRouter(Foo, key);

                assert.equal(entry.target, Foo);
                assert.equal(entry.key, key);

                const foo = new entry.facade(1, 2);
                assert.equal(foo.bar, 1);
                assert.equal(foo.baz, 2);
            });

            it('should create a wrapper for object', () => {
                const target = {
                    foo: 1,
                    bar: 2
                };
                const key = '{foo,bar}';
                const entry = new ModuleRouter(target, key);

                assert.equal(entry.target, target);
                assert.equal(entry.key, key);
                assert.equal(entry.facade.foo, 1);
                assert.equal(entry.facade.bar, 2);
            });
        });
    });

    describe('ModulesUpdater', () => {
        describe('.update()', () => {
            it('should unload modules using manager', async () => {
                const manager = new FakeManager();
                const updater = new ModulesUpdater(manager, 'HotReloadUnit/mocks/ThemeController');

                await updater.update(['foo']);
                assert.deepEqual(FakeManager.lastUnloaded, ['foo']);
            });

            it('should load modules using manager', async () => {
                const manager = new FakeManager();
                const updater = new ModulesUpdater(manager, 'HotReloadUnit/mocks/ThemeController');

                await updater.update(['bar']);
                assert.deepEqual(FakeManager.lastLoaded, ['bar']);
            });

            it('should remove css modules from themeController', async () => {
                const manager = new FakeManager();
                const updater = new ModulesUpdater(manager, 'HotReloadUnit/mocks/ThemeController');
                const themeController =  getThemeController();
                const spyRemove = sinon.spy(themeController, 'remove');
                await updater.update(['css!bar']);
                assert.isTrue(spyRemove.calledOnce);
            });
        });
    });
});
