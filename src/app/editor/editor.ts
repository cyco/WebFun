import ServiceContainer from "./service-container";
import { WindowManager, FilePicker, ComponentRegistry } from "src/ui";
import { GameData } from "src/engine";

import * as Components from "./components";
import EditorView from "./editor-view";
import EditorWindow from "./editor-window";

class Editor {
	public async run(data: GameData = null): Promise<void> {
		this.registerComponents();

		const container = ServiceContainer.default;
		container.register(ServiceContainer, container);
		const windowManager = new WindowManager(document.body);
		container.register(WindowManager, windowManager);
		container.register(Document, document);

		const editorWindow = document.createElement(EditorWindow.tagName) as EditorWindow;
		windowManager.showWindow(editorWindow);
		editorWindow.center();

		if (data) {
			return editorWindow.loadGameData(data);
		} else {
			const [file] = await FilePicker.Pick({ allowedTypes: ["data", "dta"] });
			if (!file) {
				editorWindow.close();
			}

			return editorWindow.loadFile(file);
		}
	}

	private registerComponents() {
		const registry = ComponentRegistry.sharedRegistry;
		if (registry.contains(EditorWindow)) return;

		registry.registerComponents(Components as any);
		registry.registerComponent(EditorWindow);
		registry.registerComponent(EditorView);
	}
}

export default Editor;
