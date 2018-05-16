import AbstractInspector from "./inspectors/abstract-inspector";
import { InputStream, DiscardingOutputStream, download, OutputStream } from "src/util";
import DataManager from "./data-manager";
import GameDataSerializer from "./game-data-serializer";
import FilePicker from "src/ui/file-picker";
import { readGameDataFile, GameTypeYoda, GameTypeIndy, SaveGameReader } from "src/engine";
import GameData from "src/engine/game-data";
import { Menu, Component } from "src/ui";
import buildEditorMenu from "./menu";
import MenuItemInit from "src/ui/menu-item-init";
import WindowManager from "src/ui/window-manager";
import Settings from "src/settings";
import { SaveGameInspector } from "./inspectors";
import { Storage } from "src/std.dom";
import "./editor-view.scss";

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

	public async loadFile(file: File) {
		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yoda") === -1 ? GameTypeIndy : GameTypeYoda;
		const rawData = readGameDataFile(stream, type);
		const data = new GameData(rawData);
	}

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

		const state = read(this.data.currentData);
		const inspector = new SaveGameInspector(this.state.prefixedWith("save-game"));
		this.addInspector("save-game", inspector);
		this.data.state = state;
		inspector.data = this.data;
		this.show("save-game");
	}

	set data(dm) {
		this._data = dm;
		this._inspectors.each<AbstractInspector>(
			(key: string, inspector: AbstractInspector): void => {
				inspector.data = dm;
			}
		);
	}

	get data() {
		return this._data;
	}

	get windowManager() {
		return this._windowManager;
	}
}

export default EditorView;
