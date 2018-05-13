import EditorView from "./editor-view";
import EditorWindow from "./editor-window";
import * as Components from "./components";
import { ComponentRegistry, FilePicker, WindowManager } from "src/ui";

let Initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(EditorWindow);
	ComponentRegistry.sharedRegistry.registerComponent(EditorView);

	Initialize = () => {};
};
Initialize();

const main = async (windowManager: WindowManager = WindowManager.defaultManager) => {
	Initialize();

	const [file] = await FilePicker.Pick({ allowedTypes: ["wld"] });
	if (!file) return;

	const stream = await file.provideInputStream();
	const editor = <EditorWindow>document.createElement(EditorWindow.tagName);
	editor.title = file.name;
	windowManager.showWindow(editor);
	editor.center();
	await editor.loadGameFromStream(stream);
};

export { main };
