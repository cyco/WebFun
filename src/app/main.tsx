import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";

import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import DataManager from "src/editor/data-manager";
import { GameData, ColorPalette } from "src/engine";
import { InputStream, FileLoader } from "src/util";
import { WindowManager, ComponentJSXRenderer } from "src/ui";
import { Yoda } from "src/engine/type";
import EditorWindow from "src/editor/editor-window";
import { Point } from "src/util";
import { Window } from "src/ui/components";
import { Menu, MenuItemInit, MenuItemSeparator } from "src/ui";
import { ContextMenu } from "src/ui/components";

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}

const main = async () => {
	window.WebFunJSX = new ComponentJSXRenderer();
	ComponentRegistry.sharedRegistry.registerComponents(Components as any);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents as any);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	loadSettings();

	const gameController = new GameController();
	// gameController.start();

	if (Settings.debug) {
		initializeDebug(gameController);
	}

	const editorWindow = document.createElement(EditorWindow.tagName) as EditorWindow;
	WindowManager.defaultManager.showWindow(editorWindow);
	editorWindow.center();
	const dataStreams = await FileLoader.loadAsStream("game-data/construct.dta");
	await editorWindow.loadStream(dataStreams, Yoda);

	const saveGameStream = await FileLoader.loadAsStream("save-games/construct.wld");
	await editorWindow.editor.loadSaveGameStream(saveGameStream);
};

window.addEventListener("load", main, { once: true } as any);
