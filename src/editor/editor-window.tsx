import { Window, ProgressIndicator } from "src/ui/components";
import {
	readGameDataFile,
	GameData,
	ColorPalette,
	GameType,
	GameTypeYoda,
	GameTypeIndy
} from "src/engine";
import { InputStream, PromiseProgress } from "src/util";
import { PaletteProvider } from "src/app/data";
import DataManager from "./data-manager";
import CSSTileSheet from "./css-tile-sheet";
import { ImageFactory } from "src/engine/rendering/canvas";
import buildEditorMenu from "./menu";
import { Menu, WindowMenuItem, WindowManager } from "src/ui";
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
	static readonly tagName = "wf-resource-editor-window";
	title: string = "Resource Editor";
	private _progressIndicator: HTMLElement = <ProgressIndicator />;
	private _editorView: HTMLElement = <div /> as HTMLElement;

	protected connectedCallback() {
		super.connectedCallback();
		this.content.appendChild(this._progressIndicator);
	}

	public async loadFile(file: File) {
		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yod") === -1 ? GameTypeIndy : GameTypeYoda;
		await this.loadStream(stream, type);
	}

	public async loadStream(stream: InputStream, type: GameType) {
		const rawData = readGameDataFile(stream, type);
		const data = new GameData(rawData);
		const palette = await new PaletteProvider().provide(type);
		const tileSheet = new CSSTileSheet(data.tiles.length);
		data.tiles.forEach(t => tileSheet.add(t.imageData));
		tileSheet.draw(new ImageFactory(palette));

		this._gotoFullscreen();
		const editor = document.createElement(EditorView.tagName) as EditorView;
		const state = localStorage.prefixedWith("editor");
		editor.addInspector("tile", new TileInspector(state.prefixedWith("tile")));
		editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone")));
		editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound")));
		editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle")));
		editor.addInspector("character", new CharacterInspector(state.prefixedWith("character")));
		editor.addInspector(
			"setup-image",
			new SetupImageInspector(state.prefixedWith("setup-image"))
		);
		editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette")));
		editor.data = new DataManager(data, palette, tileSheet, type);
		editor.state = state;
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
		const menuItems = buildEditorMenu(editor, this);
		menuItems.push(new WindowMenuItem(editor.windowManager));
		this.menu = new Menu(menuItems);
	}
}

export default EditorWindow;
