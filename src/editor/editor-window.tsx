import { Window, ProgressIndicator } from "src/ui/components";
import { readGameDataFile, GameData, ColorPalette, GameTypeYoda, GameTypeIndy } from "src/engine";
import { InputStream, PromiseProgress } from "src/util";
import { PaletteProvider } from "src/app/data";
import DataManager from "./data-manager";
import CSSTileSheet from "./css-tile-sheet";
import { ImageFactory } from "src/engine/rendering/canvas";
import buildEditorMenu from "./menu";
import { Menu, WindowMenuItem, WindowManager, MenuItemInit } from "src/ui";
import EditorView from "./editor-view";

import TileInspector from "src/editor/inspectors/tile-inspector";
import ZoneInspector from "src/editor/inspectors/zone-inspector";
import SoundInspector from "src/editor/inspectors/sound-inspector";
import PuzzleInspector from "src/editor/inspectors/puzzle-inspector";
import CharacterInspector from "src/editor/inspectors/character-inspector";
import PaletteInspector from "src/editor/inspectors/palette-inspector";
import SetupImageInspector from "src/editor/inspectors/setup-image-inspector";

import "./editor-window.scss";

class EditorWindow extends Window {
	static readonly TagName = "wf-resource-editor-window";
	title: string = "Resource Editor";
	private _progressIndicator: HTMLElement = <ProgressIndicator />;
	private _editorView: HTMLElement = <div /> as HTMLElement;

	connectedCallback() {
		super.connectedCallback();
		this.content.appendChild(this._progressIndicator);
	}

	public async loadFile(file: File) {
		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yod") === -1 ? GameTypeIndy : GameTypeYoda;
		const rawData = readGameDataFile(stream, type);
		const data = new GameData(rawData);
		const palette = await new PaletteProvider().provide(type);
		const tileSheet = new CSSTileSheet(data.tiles.length);
		data.tiles.forEach(t => tileSheet.add(t.imageData));
		tileSheet.draw(new ImageFactory(palette));

		this._gotoFullscreen();
		const editor = document.createElement(EditorView.TagName) as EditorView;
		const state = localStorage.prefixedWith("editor");
		this._showMenu(editor);
		this.content.textContent = "";
		this.content.appendChild(editor);
	}

	private _gotoFullscreen() {
		this.closable = false;
		this.movable = false;

		this.style.top = "";
		this.style.left = "";
		this.classList.add("fullsize");
		this.content.classList.add("fullsize");
	}
	private _showMenu(editor: EditorView) {
		const menuItems = buildEditorMenu(editor) as MenuItemInit[];
		menuItems.push(new WindowMenuItem(editor.windowManager));
		this.menu = new Menu(menuItems);
	}
}

export default EditorWindow;
