import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";

import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import { FileLoader } from "src/util";
import { WindowManager, ComponentJSXRenderer } from "src/ui";
import { Yoda } from "src/engine/type";
import EditorWindow from "src/editor/editor-window";
import SaveGameInspector from "src/editor/inspectors/save-game-inspector";
import GamepadTest from "src/debug/components/gamepad-test";
import { Window } from "src/ui/components";

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}

let editorWindow: EditorWindow;
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

	editorWindow = document.createElement(EditorWindow.tagName) as EditorWindow;
	WindowManager.defaultManager.showWindow(editorWindow);
	editorWindow.center();
	const dataStreams = await FileLoader.loadAsStream("game-data/construct.dta");
	await editorWindow.loadStream(dataStreams, Yoda);

	const saveGameStream = await FileLoader.loadAsStream("save-games/construct.wld");
	await editorWindow.editor.loadSaveGameStream(saveGameStream);
};

const rescueData = () => {
	editorWindow.editor.save();
	(editorWindow.editor.inspectors.find(
		i => i instanceof SaveGameInspector
	) as SaveGameInspector).downloadSaveGame();
};

window.document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.metaKey && e.keyCode === 83) {
		e.preventDefault();
		e.stopPropagation();

		rescueData();
	}
});

var module: any;
if (module.hot) {
	if (module.hot.addStatusHandler) {
		if (module.hot.status() === "idle") {
			module.hot.addStatusHandler((status: any) => {
				if (status === "prepare") rescueData();
			});
		}
	}
}

window.addEventListener("load", main, { once: true } as any);
