import "./editor-window.scss";

import { AbstractWindow, ProgressIndicator } from "src/ui/components";
import { Variant, readGameDataFile, ColorPalette, AssetManager } from "src/engine";
import { Menu, WindowMenuItem } from "src/ui";
import { Indy as VariantIndy, Yoda as VariantYoda } from "src/variant";

import CharacterInspector from "src/app/editor/inspectors/character-inspector";
import DataManager from "./data-manager";
import EditorView from "./editor-view";
import { InputStream } from "src/util";
import PaletteInspector from "src/app/editor/inspectors/palette-inspector";
import { PaletteProvider } from "./data";
import PuzzleInspector from "src/app/editor/inspectors/puzzle-inspector";
import StartupImageInspector from "src/app/editor/inspectors/startup-image-inspector";
import SoundInspector from "src/app/editor/inspectors/sound-inspector";
import TileInspector from "src/app/editor/inspectors/tile-inspector";
import ZoneInspector from "src/app/editor/inspectors/zone-inspector";
import CoverageInspector from "src/app/editor/inspectors/coverage-inspector";

import buildEditorMenu from "./menu";
import ServiceContainer from "./service-container";
import { Resolver, Updater } from "./reference";
import { Char, Puzzle, Sound, Tile, Zone } from "src/engine/objects";

class EditorWindow extends AbstractWindow {
	static readonly tagName = "wf-resource-editor-window";
	private _progressIndicator: HTMLElement = (<ProgressIndicator />);
	private _editor: EditorView = null;
	public di: ServiceContainer;

	constructor() {
		super();

		this.title = "Resource Editor";
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.content.appendChild(this._progressIndicator);
	}

	public async loadFile(file: File): Promise<void> {
		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yod") === -1 ? VariantIndy : VariantYoda;
		await this.loadStream(stream, type);
	}

	public async loadStream(stream: InputStream, type: Variant): Promise<void> {
		const data = readGameDataFile(stream, type);
		const assets = new AssetManager();
		assets.populate(Uint8Array, [data.startup]);
		assets.populate(
			Sound,
			data.sounds.map((s, idx) => new Sound(idx, s))
		);
		assets.populate(
			Tile,
			data.tiles.map((t, idx) => new Tile(idx, t))
		);
		assets.populate(
			Puzzle,
			data.puzzles.map((p, idx) => new Puzzle(idx, p, assets))
		);
		assets.populate(
			Char,
			data.characters.map((c, idx) => new Char(idx, c, assets))
		);
		assets.populate(
			Zone,
			data.zones.map((z, idx) => new Zone(idx, z, assets))
		);

		await this.loadGameData(assets, type);
	}

	public async loadGameData(assets: AssetManager, type: Variant): Promise<void> {
		const palette = await new PaletteProvider().provide(type);

		const di = this.di;
		const dm = new DataManager(assets, palette, type);
		di.register(DataManager, dm);
		di.register(ColorPalette, palette);
		di.register(Updater, new Updater(dm.currentData));
		di.register(Resolver, new Resolver(dm.currentData));

		this._gotoFullscreen();
		const editor = document.createElement(EditorView.tagName) as EditorView;
		const state = localStorage.prefixedWith("editor");
		editor.di = di;
		editor.addInspector("tile", new TileInspector(state.prefixedWith("tile"), di));
		editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone"), di));
		editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound"), di));
		editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle"), di));
		editor.addInspector("character", new CharacterInspector(state.prefixedWith("character"), di));
		editor.addInspector(
			"startup-image",
			new StartupImageInspector(state.prefixedWith("startup-image"), di)
		);
		editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette"), di));
		editor.addInspector("coverage", new CoverageInspector(state.prefixedWith("coverage"), di));
		editor.data = dm;
		editor.state = state;

		this._showMenu(editor);
		this.content.textContent = "";
		this.content.appendChild(editor);
		this._editor = editor;
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

	public get editor(): EditorView {
		return this._editor;
	}
}

export default EditorWindow;
