import { ComponentRegistry, FilePicker, WindowManager } from "src/ui";
import * as Components from "./components";
import EditorView from "./editor-view";
import CSSTileSheet from "./css-tile-sheet";
import DataManager from "./data-manager";
import EditorWindow from "./editor-window";

let Initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(EditorWindow);
	ComponentRegistry.sharedRegistry.registerComponent(EditorView);

	Initialize = () => {};
};
Initialize();

const main = async (windowManager: WindowManager = WindowManager.defaultManager) => {
	Initialize();

	const [file] = await FilePicker.Pick({ allowedTypes: ["data", "dta"] });
	if (!file) return;

	const editor = <EditorWindow>document.createElement(EditorWindow.tagName);
	windowManager.showWindow(editor);
	editor.center();
	await editor.loadFile(file);
};

export { main, CSSTileSheet, DataManager };
