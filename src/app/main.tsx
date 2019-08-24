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

const main = async () => {
	window.WebFunJSX = new ComponentJSXRenderer();
	ComponentRegistry.sharedRegistry.registerComponents(Components as any);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents as any);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	const gameController = new GameController(Yoda, Settings.url.yoda);
	gameController.newStory();
	gameController.show();

	if (Settings.debug) {
		initializeDebug(gameController);
	}
};

window.addEventListener("load", main, { once: true } as any);
