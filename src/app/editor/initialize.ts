import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import EditorWindow from "./editor-window";
import EditorView from "./editor-view";

export default (): void => {
	const registry = ComponentRegistry.sharedRegistry;
	if (registry.contains(EditorWindow)) return;

	registry.registerComponents(Components);
	registry.registerComponent(EditorWindow);
	registry.registerComponent(EditorView);
};
