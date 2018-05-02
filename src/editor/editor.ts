import AbstractInspector from "./inspectors/abstract-inspector";
import { DiscardingOutputStream, download, OutputStream } from "src/util";
import DataManager from "./data-manager";
import GameDataSerializer from "./game-data-serializer";
import FilePicker from "src/ui/file-picker";
import { ManualDataFileReader, GameTypeYoda, GameTypeIndy } from "src/engine";
import GameData from "src/engine/game-data";
import "./editor.scss";
import { FullscreenWindow } from "src/ui/components";
import { Menu, WindowMenuItem } from "src/ui";
import buildEditorMenu from "./menu";
import MenuItemInit from "src/ui/menu-item-init";
import WindowManager from "src/ui/window-manager";
import PaletteProvider from "src/save-game-editor/data/palette-provider";
import Settings from "src/settings";

class Editor extends FullscreenWindow {
	public static readonly TagName = "wf-editor";
	private _windowManager: WindowManager;
	private _inspectors: { [_: string]: AbstractInspector } = {};
	private _data: DataManager;

	constructor() {
		super();

		if (!this._windowManager) {
			this._windowManager = new WindowManager(this.content);
		}

		this.content.classList.add("fullsize");
	}

	connectedCallback() {
		this.closable = false;
		this.movable = false;

		super.connectedCallback();

		const menuItems = <MenuItemInit[]>buildEditorMenu(this);
		menuItems.push(new WindowMenuItem(this._windowManager));
		this.menu = new Menu(menuItems);
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

		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yoda") === -1 ? GameTypeIndy : GameTypeYoda;
		const rawData = ManualDataFileReader(stream, type);
		const data = new GameData(rawData);

		const paletteProvider = new PaletteProvider(
			Settings.url.yoda.palette,
			Settings.url.indy.palette
		);
		const palette = await paletteProvider.provide(type);

		this.data = new DataManager(data, palette);
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
}

export default Editor;
