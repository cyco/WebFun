import EditorView from "./editor-view";
import EditorWindow from "./editor-window";
import * as Components from "./components";
import { ComponentRegistry, FilePicker, WindowManager } from "src/ui";

let Initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components as any);
	ComponentRegistry.sharedRegistry.registerComponent(EditorWindow);
	ComponentRegistry.sharedRegistry.registerComponent(EditorView);

	Initialize = () => {};
};
Initialize();

const OverlayedWindowOffset = 10.0;
const main = async (windowManager: WindowManager): Promise<void[]> => {
	Initialize();

	let editors = 0;
	return Promise.all(
		(
			await FilePicker.Pick({
				allowedTypes: ["wld"],
				allowsMultipleFiles: true
			})
		).map(async file => {
			const stream = await file.provideInputStream();
			const editor = document.createElement(EditorWindow.tagName) as EditorWindow;
			editor.title = file.name;
			windowManager.showWindow(editor);
			editor.center();
			editor.origin = editor.origin.byAdding(
				OverlayedWindowOffset * editors,
				OverlayedWindowOffset * editors
			);
			editors++;
			await editor.loadGameFromStream(stream);
		})
	);
};

export { main, EditorView };
