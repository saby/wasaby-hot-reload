export default class Control {
    forceUpdated: boolean = false;

    _forceUpdate(): void {
        this.forceUpdated = true;
    }
}
