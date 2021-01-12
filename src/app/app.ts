import { Settings } from "src";
import { Yoda } from "src/engine/type";
import { WindowManager } from "src/ui";
import { GlobalFileDrop } from "src/ux";
import GameController from "./game-controller";

class App {
	private settings = Settings;
	private defaultGameController: GameController;
	private windowManager: WindowManager = WindowManager.defaultManager;

	public run(): void {
		this.setupSaveGameFileHandler();
		this.setupTestFileHandler();
		this.showInitialWindow();
		this.ensureAddressbarCanBeHidden();
	}

	private setupSaveGameFileHandler(): void {
		const fileDrop = GlobalFileDrop.defaultHandler;
		fileDrop.addHandler("wld", file => this.defaultGameController.load(file));
	}

	private async setupTestFileHandler(): Promise<void> {
		if (!this.settings.debug) return;

		const fileDrop = GlobalFileDrop.defaultHandler;
		const loadFile = await require("src/debug/load-test");
		fileDrop.addHandler("wftest", (file: File) =>
			loadFile.default(this.defaultGameController)(file)
		);
		fileDrop.addHandler("xwftest", (file: File) =>
			loadFile.default(this.defaultGameController)(file)
		);
		fileDrop.addHandler("fwftest", (file: File) =>
			loadFile.default(this.defaultGameController)(file)
		);
	}

	private showInitialWindow(): void {
		this.defaultGameController = new GameController(Yoda, Settings.url.yoda);
		this.defaultGameController.newStory();
		this.defaultGameController.show(this.windowManager);
	}

	private ensureAddressbarCanBeHidden(): void {
		if (!this.settings.mobile) return;
		if (this.settings.pwa) return;

		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}
}

export default App;
