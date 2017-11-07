import Menu from "./menu";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import Editor from "./editor";
import {
	CharacterInspector,
	PaletteInspector,
	PuzzleInspector,
	SetupImageInspector,
	SoundInspector,
	TileInspector,
	ZoneInspector
} from "./inspectors";
import { PrefixedStorage } from "src/util";
import GameController from "src/app/game-controller";
import DataManager from "./data-manager";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);

	const state = new PrefixedStorage(localStorage, "editor");
	const inspectors = {
		"tile": new TileInspector(state.prefixedWith("tile")),
		"zone": new ZoneInspector(state.prefixedWith("zone")),
		"sound": new SoundInspector(state.prefixedWith("sound")),
		"puzzle": new PuzzleInspector(state.prefixedWith("puzzle")),
		"character": new CharacterInspector(state.prefixedWith("character")),
		"setup-image": new SetupImageInspector(state.prefixedWith("setup-image")),
		"palette": new PaletteInspector(state.prefixedWith("palette"))
	};

	Editor.sharedEditor = new Editor(inspectors);

	gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) => {
		const gameData = e.detail.data;
		const palette = e.detail.palette;

		Editor.sharedEditor.data = new DataManager(gameData, palette);
	});
};

export { initialize, Components, Menu };
