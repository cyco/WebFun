import AbstractInspector from "./inspectors/abstract-inspector";
import { DiscardingOutputStream, download, OutputStream } from "src/util";
import DataManager from "./data-manager";
import GameDataSerializer from "./game-data-serializer";
import FilePicker from "src/ui/file-picker";
import { readGameDataFile, GameTypeYoda, GameTypeIndy } from "src/engine";
import GameData from "src/engine/game-data";
import { Menu, Component } from "src/ui";
import buildEditorMenu from "./menu";
import MenuItemInit from "src/ui/menu-item-init";
import WindowManager from "src/ui/window-manager";
import Settings from "src/settings";
import "./editor-view.scss";

class EditorView extends Component {
	public static readonly TagName = "wf-editor-view";
	private _windowManager: WindowManager;
	private _inspectors: { [_: string]: AbstractInspector } = {};
	private _data: DataManager;

	constructor() {
		super();

		if (!this._windowManager) {
			this._windowManager = new WindowManager(this);
		}
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
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
