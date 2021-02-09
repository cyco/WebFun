import "./editor-window.scss";

import { AbstractWindow, ProgressIndicator } from "src/ui/components";
import {
	GameData,
	Variant,
	VariantIndy,
	VariantYoda,
	readGameDataFile,
	ColorPalette
} from "src/engine";
import { Menu, WindowMenuItem } from "src/ui";

import CharacterInspector from "src/app/editor/inspectors/character-inspector";
import DataManager from "./data-manager";
import EditorView from "./editor-view";
import { InputStream } from "src/util";
import PaletteInspector from "src/app/editor/inspectors/palette-inspector";
import { PaletteProvider } from "./data";
import PuzzleInspector from "src/app/editor/inspectors/puzzle-inspector";
import SetupImageInspector from "src/app/editor/inspectors/setup-image-inspector";
import SoundInspector from "src/app/editor/inspectors/sound-inspector";
import TileInspector from "src/app/editor/inspectors/tile-inspector";
import ZoneInspector from "src/app/editor/inspectors/zone-inspector";
import CoverageInspector from "src/app/editor/inspectors/coverage-inspector";

import buildEditorMenu from "./menu";
import ServiceContainer from "./service-container";
import { Resolver, Updater } from "./reference";

class EditorWindow extends AbstractWindow {
	static readonly tagName = "wf-resource-editor-window";
	private _progressIndicator: HTMLElement = (<ProgressIndicator />);
	private _editor: EditorView = null;
	private di: ServiceContainer = ServiceContainer.default.get(ServiceContainer);

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
		const rawData = readGameDataFile(stream, type);
		const data = new GameData(rawData);
		(data as any)._type = type;
		this.di.register(GameData, data);
		await this.loadGameData(data);
	}

	public async loadGameData(data: GameData): Promise<void> {
		const palette = await new PaletteProvider().provide(data.type);

		const dm = new DataManager(data, palette, data.type);
		this.di.register(DataManager, dm);
		this.di.register(GameData, dm.currentData);
		this.di.register(ColorPalette, palette);
		this.di.register(Updater, new Updater(dm.currentData));
		this.di.register(Resolver, new Resolver(dm.currentData));

		this._gotoFullscreen();
		const editor = document.createElement(EditorView.tagName) as EditorView;
		const state = localStorage.prefixedWith("editor");
		editor.addInspector("tile", new TileInspector(state.prefixedWith("tile")));
		editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone")));
		editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound")));
		editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle")));
		editor.addInspector("character", new CharacterInspector(state.prefixedWith("character")));
		editor.addInspector("setup-image", new SetupImageInspector(state.prefixedWith("setup-image")));
		editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette")));
		editor.addInspector("coverage", new CoverageInspector(state.prefixedWith("coverage")));
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
