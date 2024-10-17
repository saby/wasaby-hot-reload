import {IControlNode} from 'HotReload/eventStream/client/_ComponentsUpdater';

class Document {
    controlNodes: IControlNode[] = [];
    children: HTMLCollection = [] as unknown as HTMLCollection;
}

type DocumentConstructor = new() => Document & ParentNode;

export default Document as unknown as DocumentConstructor;
