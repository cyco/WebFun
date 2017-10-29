import AbstractInspector from "./inspectors/abstract-inspector";
import { DiscardingOutputStream, download, PrefixedStorage } from "src/util";
import DataManager from "./data-manager";
import GameDataSerializer from "./game-data-serializer";
import OutputStream from "src/util/output-stream";

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
	private _data: DataManager;

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

	public save() {
		const serializer = new GameDataSerializer();
		const sizeCalculationStream = new DiscardingOutputStream();
		serializer.serialize(this.data.currentData, sizeCalculationStream);
		const outputStream = new OutputStream(sizeCalculationStream.offset);
		serializer.serialize(this.data.currentData, outputStream);

		download(outputStream.buffer, "yoda.data");
	}

	public load() {
	}

	set data(dm) {
		this._data = dm;
		this._inspectors.each<AbstractInspector>((key: string, inspector: AbstractInspector): void => {
			inspector.data = dm;
		});
	}

	get data() {
		return this._data;
	}
}

export default Editor;
