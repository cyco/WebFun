import "src/_style/global.scss";
import "src/extension";

import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";

import { ComponentJSXRenderer, ComponentRegistry, Components } from "src/ui";

import "./bootstrap-components.ts";
import App from "./app";
import { observable, persistent } from "src/util";
import { defaultSettings } from "src/settings";

const main = async () => {
	const settings = observable(persistent(defaultSettings, "settings", localStorage));
	if (settings.debug) {
		window.WebFun = await require("src/index");
		require("src/app/editor/initialize").default();
		require("src/app/webfun/debug/initialize").default();
	}

	window.WebFun = window.WebFun || { JSX: null, App: { App } as any };
	window.WebFun.JSX = new ComponentJSXRenderer();

	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	const container = document.querySelector("wf-app") as HTMLElement;
	const app = new App(container, settings);
	app.run();
};

window.addEventListener("load", main, { once: true });
