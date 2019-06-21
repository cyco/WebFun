import "./editor-view.scss";

import { DiscardingOutputStream, InputStream, OutputStream, download } from "src/util";

import AbstractInspector from "./inspectors/abstract-inspector";
import { Component } from "src/ui";
import DataManager from "./data-manager";
import FilePicker from "src/ui/file-picker";
import GameDataSerializer from "./game-data-serializer";
import { SaveGameInspector } from "./inspectors";
import { SaveGameReader, AssetManager } from "src/engine";
import WindowManager from "src/ui/window-manager";
import { Tile, Zone, Puzzle, Char, Sound } from "src/engine/objects";

class EditorView extends Component {
	public static readonly tagName = "wf-editor-view";
	private _windowManager: WindowManager;
	private _inspectors: { [_: string]: AbstractInspector } = {};
	private _data: DataManager;
	public state: Storage;

	constructor() {
		super();

		if (!this._windowManager) {
			this._windowManager = new WindowManager(this);
		}
	}

	addInspector(name: string, inspector: AbstractInspector) {
		inspector.windowManager = this._windowManager;
		this._inspectors[name] = inspector;
	}

	public show(key: string) {
		this._windowManager.asDefaultManager(() => this._inspectors[key].show());
	}

	public save() {
		const serializer = new GameDataSerializer();
		const sizeCalculationStream = new DiscardingOutputStream();
		serializer.serialize(this.data.currentData, sizeCalculationStream);
		const outputStream = new OutputStream(sizeCalculationStream.offset);
		serializer.serialize(this.data.currentData, outputStream);

		download(outputStream.buffer, "yoda.data");
	}

	public async load() {
		const filePicker = new FilePicker();
		const [file] = await filePicker.pickFile();
		if (!file) return;

		await this.loadFile(file);
	}

	public async loadFile(_: File) {}

	public async loadSaveGame() {
		const filePicker = new FilePicker();
		const [file] = await filePicker.pickFile();
		if (!file) return;

		this.loadSaveGameFile(file);
	}

	public async loadSaveGameFile(file: File) {
		const stream = await file.provideInputStream();
		await this.loadSaveGameStream(stream);
	}

	public async loadSaveGameStream(stream: InputStream) {
		const { type, read } = SaveGameReader.build(stream);
		if (type !== this.data.type) {
			console.log("Save game does not match current game type!");
			return;
		}

		const data = this.data.currentData;
		const assetManager = new AssetManager();
		assetManager.populate(Zone, data.zones);
		assetManager.populate(Tile, data.tiles);
		assetManager.populate(Puzzle, data.puzzles);
		assetManager.populate(Char, data.characters);
		assetManager.populate(Sound, data.sounds);
		const state = read(assetManager);
		const inspector = new SaveGameInspector(this.state.prefixedWith("save-game"));
		this.addInspector("save-game", inspector);
		this.data.state = state;
		inspector.data = this.data;
		this.show("save-game");
	}

	get data() {
		return this._data;
	}

	set data(dm) {
		this._data = dm;
		this._inspectors.each<AbstractInspector>((_: string, inspector: AbstractInspector): void => {
			inspector.data = dm;
		});
	}

	get inspectors() {
		return Object.values(this._inspectors) as AbstractInspector[];
	}

	get windowManager() {
		return this._windowManager;
	}
}

export default EditorView;
