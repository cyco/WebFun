import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";

import { ComponentRegistry } from "src/ui";
import * as Components from "src/ui/components";
import * as SaveGameEditorComponents from "./components";
import * as EditorComponents from "../editor/components";
import { DataManager } from "src/editor";
import { GameData, ColorPalette } from "src/engine";
import SaveGameEditor from "./save-game-editor";
import { InputStream } from "src/util";
import { XMLHttpRequest } from "src/std.dom";
import { WindowManager } from "src/ui";

const main = () => {
	console.log("thing");
	try {
		ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	} catch (e) {}
	try {
		ComponentRegistry.sharedRegistry.registerComponents(<any>EditorComponents);
	} catch (e) {}
	try {
		ComponentRegistry.sharedRegistry.registerComponent(<any>SaveGameEditorComponents);
	} catch (e) {}

	const ajax = new XMLHttpRequest();
	ajax.responseType = "arraybuffer";
	ajax.onload = () => {
		const setupData = async (g: GameData, p: ColorPalette) => {
			const saveGameEditor = <SaveGameEditor>document.createElement(
				SaveGameEditor.TagName
			);
			saveGameEditor.gameDataManager = new DataManager(g, p);
			saveGameEditor.file = <any>{
				name: "weapon-blaster-2.wld",
				provideInputStream() {
					return new InputStream(ajax.response);
				}
			};
			WindowManager.defaultManager.showWindow(saveGameEditor);
		};

		/*
		if (gameController.isDataLoaded()) {
			setupData(gameController.data, gameController.palette);
		} else {
			gameController.addEventListener(
				GameController.Event.DidLoadData,
				(e: CustomEvent) => setupData(e.detail.data, e.detail.palette)
			);
		}
*/
	};
	ajax.open("GET", "weapon-blaster-2.wld", true);
	ajax.send();
};

window.addEventListener("load", main, { once: true } as any);
