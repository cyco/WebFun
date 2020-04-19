import "../extension";
import "../_style/global.scss";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer } from "src/ui";
import { ComponentRegistry, Components } from "src/ui";

import GameController from "./game-controller";
import Settings from "src/settings";
import { Yoda } from "src/engine/type";
import initializeDebug from "src/debug/initialize";
import "./bootstrap-components.ts";
import OnScreenButton from "src/app/ui/onscreen-button";
import OnScreenPad from "src/app/ui/onscreen-pad";
import * as SmartPhone from "detect-mobile-browser";
import "./main.scss";

const endPreload = () => {
	const container = document.getElementById("webfun-preload");
	if (container) container.remove();
};

const main = async () => {
	// localStorage.clear();

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

	if (!Settings.mobile) {
		document.body.appendChild(
			<div id="onscreen-test">
				<button
					onclick={(e: MouseEvent) => {
						(e.target as any).classList.toggle("active");
						(e.target as any).parentElement.classList.toggle("edit");
					}}>
					Edit
				</button>
				<OnScreenButton id="btn_1" label="Shoot"></OnScreenButton>
				<OnScreenButton id="btn_2" label="Drag"></OnScreenButton>

				<OnScreenPad id="pad_1"></OnScreenPad>
			</div>
		);
	}
};

window.addEventListener("load", main, { once: true });
