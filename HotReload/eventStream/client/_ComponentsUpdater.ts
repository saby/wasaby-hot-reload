export interface IControl {
    _forceUpdate(): void;
}

export interface IControlNode {
    control: IControl;
}

export interface IControlElement extends Element {
    controlNodes: IControlNode[];
}

/**
 * Checks that given DOM element is a control
 * @param element DOM element
 */
function isComponentElement(element: IControlElement): boolean {
    return !!element.controlNodes;
}

/**
 * Goes through each component node from given parent and returns it in callback
 * @param parent Parent component
 * @param callback Callback
 */
function eachComponent(parent: ParentNode, callback: (component: IControlElement) => void): void {
    const children = parent.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (isComponentElement(child as IControlElement)) {
            callback(child as IControlElement);
        }
        eachComponent(child, callback);
    }

    if (isComponentElement(parent as IControlElement)) {
        callback(parent as IControlElement);
    }
}

/**
 * Обновляет примонтированные компоненты приложения
 */
export default class ComponentsUpdater {
    /**
     * Конструктор
     * @param root Корневой элемент, в котором запущено приложение
     */
    constructor(protected root: ParentNode) {
    }

    /**
     * Обновляет компоненты приложения
     * @param modules Имена модулей
     */
    update(modules: string[]): void {
        eachComponent(this.root, (component: IControlElement) => {
            component.controlNodes.forEach((node) => {
                node.control._forceUpdate();
            });
        });
    }
}
