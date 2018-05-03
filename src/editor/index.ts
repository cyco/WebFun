import { ComponentRegistry, FilePicker, WindowManager } from "src/ui";
import * as Components from "./components";
import Editor from "./editor";
import GameController from "src/app/game-controller";
import CSSTileSheet from "./css-tile-sheet";
import DataManager from "./data-manager";
import {
	TileInspector,
	ZoneInspector,
	SetupImageInspector,
	SoundInspector,
	PaletteInspector,
	PuzzleInspector,
	CharacterInspector
} from "./inspectors";

let Initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(Editor);

	Initialize = () => {};
};
Initialize();

const main = async (windowManager: WindowManager = WindowManager.defaultManager) => {
	Initialize();

	const [file] = await FilePicker.Pick({ allowedTypes: ["wld"] });
	if (!file) return;

	const editor = <Editor>document.createElement(Editor.TagName);
	const state = localStorage.prefixedWith("editor");

	editor.addInspector("tile", new TileInspector(state.prefixedWith("tile")));
	editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone")));
	editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound")));
	editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle")));
	editor.addInspector("character", new CharacterInspector(state.prefixedWith("character")));
	editor.addInspector("setup-image", new SetupImageInspector(state.prefixedWith("setup-image")));
	editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette")));
	await editor.loadFile(file);
	windowManager.showWindow(editor);
};

export { main, CSSTileSheet, DataManager };
