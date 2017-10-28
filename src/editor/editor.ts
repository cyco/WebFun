import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import PrefixedStorage from "src/util/prefixed-storage";

class Editor {
	private static _sharedEditor: Editor;
	public static set sharedEditor(e: Editor) {
		this._sharedEditor = e;
	}

	public static get sharedEditor() {
		return this._sharedEditor;
	}

	private _stateStorage: Storage;
	private _inspectors: {[_: string]: AbstractInspector};

	constructor(inspectors: {[_: string]: AbstractInspector}) {
		this._inspectors = inspectors;
	}

	public show(key: string) {
		this._inspectors[key].show();
	}

	public set storage(storage: Storage) {
		this._stateStorage = storage;

		this._inspectors.each<AbstractInspector>((key: string, inspector: AbstractInspector): void => {
			inspector.state = new PrefixedStorage(storage, key);
		});
	}
}

export default Editor;
