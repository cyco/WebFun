import AbstractInspector from "./inspectors/abstract-inspector";
import { DiscardingOutputStream, download, OutputStream } from "src/util";
import DataManager from "./data-manager";
import GameDataSerializer from "./game-data-serializer";
import FilePicker from "src/ui/file-picker";
import DataFileReader from "src/engine/file-format/yodesk.js";
import { KaitaiStream } from "src/libs";
import GameData from "src/engine/game-data";
import "./editor.scss";
import { FullscreenWindow } from "src/ui/components";
import { Menu, WindowMenuItem } from "src/ui";
import buildEditorMenu from "./menu";
import MenuItemInit from "src/ui/menu-item-init";
import WindowManager from "src/ui/window-manager";

class Editor extends FullscreenWindow {
	public static readonly TagName = "wf-editor";
	private windowManager: WindowManager;

	connectedCallback() {
		this.closable = false;
		this.movable = false;

		super.connectedCallback();

		if (!this.windowManager) {
			this.windowManager = new WindowManager(this.content);
		}

		const menuItems = <MenuItemInit[]>buildEditorMenu(this);
		menuItems.push(new WindowMenuItem(this.windowManager));
		this.menu = new Menu(menuItems);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	private static _sharedEditor: Editor;
	public static set sharedEditor(e: Editor) {
		this._sharedEditor = e;
	}

	public static get sharedEditor() {
		return this._sharedEditor;
	}

	private _inspectors: {[_: string]: AbstractInspector};
	private _data: DataManager;

	constructor() {
		super();
		this._inspectors = {};
	}

	addInspector(name: string, inspector: AbstractInspector) {
		this._inspectors[name] = inspector;
	}

	public show(key: string) {
		this.windowManager.asDefaultManager(() => this._inspectors[key].show());
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

		const buffer = await file.readAsArrayBuffer();
		const stream = new KaitaiStream(buffer);
		const rawData = new DataFileReader(stream);
		const data = new GameData(rawData);

		this.data = new DataManager(data, this.data.palette);
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
