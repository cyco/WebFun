import "core-js/stable";
import "regenerator-runtime/runtime";
import "../extension";
import "../_style/global.scss";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer } from "src/ui";
import { ComponentRegistry, Components } from "src/ui";

import GameController from "./game-controller";
import Settings from "src/settings";
import { Yoda } from "src/engine/type";
import { initialize as initializeDebug } from "src/debug";
import "./bootstrap-components.ts";

import * as WebFunLib from "../";

declare global {
	var WebFun: typeof WebFunLib;
}

const endPreload = () => {
	const container = document.getElementById("webfun-preload");
	if (container) container.remove();
};

const main = async () => {
	window.WebFun.JSX = new ComponentJSXRenderer();
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	endPreload();
	const gameController = new GameController(Yoda, Settings.url.yoda);
	gameController.newStory();
	gameController.show();
	if (Settings.mobile) {
		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}
	if (Settings.debug) {
		initializeDebug(gameController);
	}
};

window.WebFun = WebFunLib as any;
window.addEventListener("load", main, { once: true });
