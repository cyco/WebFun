import "../_style/global.scss";
import "../extension";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer, ComponentRegistry, Components } from "src/ui";
import { GlobalFileDrop } from "src/ux";

import GameController from "./game-controller";
import Settings from "src/settings";
import { Yoda } from "src/engine/type";
import "./bootstrap-components.ts";

const main = async () => {
	localStorage.clear();
	//
	window.WebFun = await require("src/index");
	//*/

	// Setup Custom Elements
	window.WebFun = window.WebFun || { JSX: null };
	window.WebFun.JSX = new ComponentJSXRenderer();

	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	// End preload
	const container = document.getElementById("webfun-preload");
	if (container) container.remove();

	// Setup global file handler
	const fileDrop = GlobalFileDrop.defaultHandler;
	if (Settings.debug) {
		const loadFile = await require("src/debug/load-test");
		fileDrop.addHandler("wftest", (file: File) => loadFile.default(gameController)(file));
		fileDrop.addHandler("xwftest", (file: File) => loadFile.default(gameController)(file));
		fileDrop.addHandler("fwftest", (file: File) => loadFile.default(gameController)(file));
	}

	fileDrop.addHandler("wld", file => gameController.load(file));

	// Show initial game window
	const gameController = new GameController(Yoda, Settings.url.yoda);
	gameController.newStory();
	gameController.show();
	if (Settings.mobile && !Settings.pwa) {
		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}
};

window.addEventListener("load", main, { once: true });
