import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import { initialize as initializeEditor } from "src/editor";
import { initialize as initializeSaveGameEditor } from 'src/save-game-editor';
import SaveGameEditor from 'src/save-game-editor/save-game-editor';
import DataManager from 'src/editor/data-manager';
import { GameData, ColorPalette } from 'src/engine';
import { InputStream } from 'src/util';
import {
	WindowManager,
	ComponentJSXRenderer
} from 'src/ui';

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

	const ajax = new XMLHttpRequest();
	ajax.responseType = 'arraybuffer';
	ajax.onload = () => {
		const setupData = async (g: GameData, p: ColorPalette) => {

			const saveGameEditor = <SaveGameEditor>document.createElement(SaveGameEditor.TagName);
			saveGameEditor.gameDataManager = new DataManager(g, p);
			saveGameEditor.file = <any>{
				name: 'weapon-blaster-2.wld', provideInputStream() {
					return new InputStream(ajax.response);
				}
			};
			WindowManager.defaultManager.showWindow(saveGameEditor);
		};

		if (gameController.isDataLoaded()) {
			setupData(gameController.data, gameController.palette);
		} else {
			gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) =>
				setupData(e.detail.data, e.detail.palette)
			);
		}
	};
	ajax.open("GET", "weapon-blaster-2.wld", true);
	ajax.send();
};
