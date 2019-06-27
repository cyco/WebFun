import { ComponentRegistry, FilePicker, WindowManager } from "src/ui";
import * as Components from "./components";
import EditorView from "./editor-view";
import DataManager from "./data-manager";
import EditorWindow from "./editor-window";
import { GameData } from "src/engine";

let Initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components as any);
	ComponentRegistry.sharedRegistry.registerComponent(EditorWindow);
	ComponentRegistry.sharedRegistry.registerComponent(EditorView);

	Initialize = () => {};
};
Initialize();

const main = async (windowManager: WindowManager = WindowManager.defaultManager, data: GameData = null) => {
	Initialize();
	if (data) {
		const editor = document.createElement(EditorWindow.tagName) as EditorWindow;
		windowManager.showWindow(editor);
		editor.center();
		await editor.loadGameData(data);
		return;
	}

	const [file] = await FilePicker.Pick({ allowedTypes: ["data", "dta"] });
	if (!file) return;

	const editor = document.createElement(EditorWindow.tagName) as EditorWindow;
	windowManager.showWindow(editor);
	editor.center();
	await editor.loadFile(file);
};

export { main, DataManager };
