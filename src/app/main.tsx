import "../_style/global.scss";
import "../extension";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer, ComponentRegistry, Components } from "src/ui";

import "./bootstrap-components.ts";
import App from "./app";
import { Settings } from "src";

const main = async () => {
	if (Settings.debug) {
		localStorage.clear();
		window.WebFun = await require("src/index");
	}

	// Setup custom elements
	window.WebFun = window.WebFun || { JSX: null };
	window.WebFun.JSX = new ComponentJSXRenderer();

	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	const app = new App();
	app.run();

	// End preload
	const container = document.getElementById("webfun-preload");
	if (container) container.remove();
};

window.addEventListener("load", main, { once: true });
