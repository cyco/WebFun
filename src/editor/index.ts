import Menu from "./menu";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import Editor from "./editor";
import {
	CharacterInspector,
	PuzzleInspector,
	SetupImageInspector,
	SoundInspector,
	TileInspector,
	ZoneInspector
} from "./inspectors";
import PrefixedStorage from "src/util/prefixed-storage";
import GameController from "src/app/game-controller";
import DataManager from "./data-manager";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);

	const inspectors = {
		"tile": new TileInspector(),
		"zone": new ZoneInspector(),
		"sound": new SoundInspector(),
		"puzzle": new PuzzleInspector(),
		"character": new CharacterInspector(),
		"setup-image": new SetupImageInspector()
	};

	Editor.sharedEditor = new Editor(inspectors);
	Editor.sharedEditor.storage = new PrefixedStorage(localStorage, "editor");

	gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) => {
		const gameData = e.detail.data;
		const palette = e.detail.palette;

		Editor.sharedEditor.data = new DataManager(gameData, palette);
	});
};

export { initialize, Menu };
