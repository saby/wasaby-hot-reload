const defaultDriverName = 'RequireJsLoader/Driver';

export class DefaultDriver {
}

export default function setUp(
    driverName: string = defaultDriverName,
    DriverConstructror: Function = DefaultDriver
): () => void {
    define(driverName, () => DriverConstructror);

    return function tearDown(): void {
        requirejs.undef(driverName);
    }
}
