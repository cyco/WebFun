import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import { initialize as initializeEditor } from "src/editor";
import { initialize as initializeSaveGameEditor } from 'src/save-game-editor';
import { ComponentJSXRenderer } from 'src/ui';

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}

export default () => {
	window.WebFunJSX = new ComponentJSXRenderer();
	loadSettings();

	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	const gameController = new GameController();
	gameController.start();

	if (Settings.debug) {
		initializeDebug(gameController);
	}

	if (Settings.editor) {
		initializeEditor(gameController);
	}

	if (Settings.saveGameEditor) {
		initializeSaveGameEditor(gameController);
	}
};
