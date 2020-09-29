import "../_style/global.scss";
import "../extension";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer } from "src/ui";
import { ComponentRegistry, Components } from "src/ui";

import GameController from "./game-controller";
import Settings from "src/settings";
import { Yoda } from "src/engine/type";
import "./bootstrap-components.ts";
import * as SmartPhone from "detect-mobile-browser";

const endPreload = () => {
	const container = document.getElementById("webfun-preload");
	if (container) container.remove();
};

const main = async () => {
	localStorage.clear();

	window.WebFun = window.WebFun || { JSX: null };
	window.WebFun.JSX = new ComponentJSXRenderer();

	Settings.mobile = SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone();

	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	endPreload();

	if ("serviceWorker" in navigator) {
		// navigator.serviceWorker.register("assets/webfun.sw.js");
	}

	const gameController = new GameController(Yoda, Settings.url.yoda);
	gameController.newStory();
	gameController.show();
	if (Settings.mobile) {
		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}

	if (Settings.debug) {
		// await initializeDebug(gameController);
	}
};

window.addEventListener("load", main, { once: true });
