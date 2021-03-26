import "src/_style/global.scss";
import "src/extension";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer, ComponentRegistry, Components } from "src/ui";

import "./bootstrap-components.ts";
import App from "./app";
import { Settings } from "src";

const main = async () => {
	if (Settings.debug) {
		window.WebFun = await require("src/index");
		//localStorage.clear();
	}

	// Setup custom elements
	window.WebFun = window.WebFun || { JSX: null };
	window.WebFun.JSX = new ComponentJSXRenderer();

	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	const container = document.querySelector("wf-app") as HTMLElement;
	const app = new App(container);
	app.run();

	if (Settings.debug) {
		(await require("src/app/editor/initialize")).default();
		(await require("src/app/webfun/debug/initialize")).default();
	}
};

window.addEventListener("load", main, { once: true });
