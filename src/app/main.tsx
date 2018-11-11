import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";

import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import { initialize as initializeDebug } from "src/debug";
import { FileLoader } from "src/util";
import { WindowManager, ComponentJSXRenderer } from "src/ui";
import { Yoda } from "src/engine/type";
import EditorWindow from "src/editor/editor-window";
import SaveGameInspector from "src/editor/inspectors/save-game-inspector";

declare global {
	interface Window {
		WebFunJSX: ComponentJSXRenderer;
	}
}
type Components<Entry> = Extract<Entry[keyof Entry], { readonly tagName: string } & { new (): any }>;
type ComponentDefinitions<Bundle> = {
	[TagName in Components<Bundle>["tagName"]]: Extract<Components<Bundle>, { tagName: TagName }>
};
type CustomElements = ComponentDefinitions<typeof Components> &
	ComponentDefinitions<typeof AppComponents> &
	ComponentDefinitions<typeof WindowComponents>;

declare global {
	interface Document {
		createElement<T extends keyof CustomElements>(tagName: T): InstanceType<CustomElements[T]>;
	}
}

let editorWindow: EditorWindow;
const main = async () => {
	window.WebFunJSX = new ComponentJSXRenderer();
	ComponentRegistry.sharedRegistry.registerComponents(Components as any);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents as any);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents as any);

	loadSettings();

	if (true) {
		const gameController = new GameController();
		gameController.newStory();
		gameController.show();

		if (Settings.debug) {
			initializeDebug(gameController);
		}

		return;
	}

	editorWindow = document.createElement(EditorWindow.tagName) as EditorWindow;
	WindowManager.defaultManager.showWindow(editorWindow);
	editorWindow.center();
	const dataStreams = await FileLoader.loadAsStream("game-data/construct.data");
	await editorWindow.loadStream(dataStreams, Yoda);

	const saveGameStream = await FileLoader.loadAsStream("save-games/construct.wld");
	await editorWindow.editor.loadSaveGameStream(saveGameStream);
};

const rescueData = () => {
	editorWindow.editor.save();
	(editorWindow.editor.inspectors.find(
		i => i instanceof SaveGameInspector
	) as SaveGameInspector).downloadSaveGame();
};

window.document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.metaKey && e.keyCode === 83) {
		e.preventDefault();
		e.stopPropagation();

		rescueData();
	}
});

declare global {
	var module: any;
}

if (module.hot) {
	if (module.hot.addStatusHandler) {
		if (module.hot.status() === "idle") {
			module.hot.addStatusHandler((status: any) => {
				if (status === "prepare") rescueData();
			});
		}
	}
}

window.addEventListener("load", main, { once: true } as any);
