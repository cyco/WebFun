import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";

import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import { initialize as initializeEditor } from "src/editor";
import { SaveGameEditor, initialize as initializeSaveGameEditor } from "src/save-game-editor";
import DataManager from "src/editor/data-manager";
import { GameData, ColorPalette } from "src/engine";
import { InputStream } from "src/util";
import { WindowManager, ComponentJSXRenderer } from "src/ui";

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}

const main = () => {
	window.WebFunJSX = new ComponentJSXRenderer();
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	loadSettings();

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

window.addEventListener("load", main, { once: true } as any);
