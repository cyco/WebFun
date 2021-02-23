import ServiceContainer from "./service-container";
import { WindowManager, FilePicker } from "src/ui";
import { GameData } from "src/engine";
import EditorWindow from "./editor-window";

class Editor {
	private window: EditorWindow;
	private container = ServiceContainer.default;

	public async run(data: GameData = null): Promise<void> {
		const windowManager = new WindowManager(document.body);
		this.container.register(ServiceContainer, this.container);
		this.container.register(WindowManager, windowManager);
		this.container.register(Document, document);

		try {
			this.window = document.createElement(EditorWindow.tagName) as EditorWindow;
			windowManager.showWindow(this.window);
			this.window.center();

			if (data) {
				return await this.window.loadGameData(data);
			} else {
				const [file] = await FilePicker.Pick({ allowedTypes: ["data", "dta"] });
				if (!file) {
					this.window.close();
				}

				return await this.window.loadFile(file);
			}
		} catch (e) {
			this.stop();
		}
	}

	private stop(): void {
		if (!this.window) return;

		this.window.close();
		this.window = null;
	}
}

export default Editor;
