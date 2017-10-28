import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeEditor } from "src/editor";
import { initialize as initializeDebug } from "src/debug";

export default () => {
	loadSettings();

	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	const gameController = new GameController();
	gameController.start();

	if (Settings.debug) {
		initializeDebug();
	}
	if (Settings.editor) {
		initializeEditor(gameController);
	}
};
