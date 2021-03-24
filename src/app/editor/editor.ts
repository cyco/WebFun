import ServiceContainer from "./service-container";
import { FilePicker, WindowManager } from "src/ui";
import { GameData } from "src/engine";
import EditorWindow from "./editor-window";

class Editor {
	private window: EditorWindow;
	private container: ServiceContainer;

	public async run(data: GameData = null): Promise<void> {
		const windowManager = new WindowManager(document.body);
		this.container = new ServiceContainer();
		this.container.register(ServiceContainer, this.container);
		this.container.register(WindowManager, windowManager);
		this.container.register(Document, document);

		try {
			this.window = document.createElement(EditorWindow.tagName) as EditorWindow;
			this.window.di = this.container;
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
			console.error("Closing editor because of error!");
			console.error(e);

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
