import { Settings } from "src";
import { Variant, Indy, IndyDemo, Yoda, YodaDemo } from "src/engine/variant";
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
		//this.showInitialWindow();
		this.createLinks();
		this.ensureAddressbarCanBeHidden();
	}

	private setupSaveGameFileHandler(): void {
		const fileDrop = GlobalFileDrop.defaultHandler;
		fileDrop.addHandler("wld", file => this.defaultGameController?.load(file));
	}

	private async setupTestFileHandler(): Promise<void> {
		if (!this.settings.debug) return;

		const fileDrop = GlobalFileDrop.defaultHandler;
		const loadFile = await require("src/app/webfun/debug/load-test");
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
		this.defaultGameController = null;
	}

	private createLinks(): void {
		const games: [string, Variant, any][] = [
			["Yoda Stories", Yoda, Settings.url.yoda],
			["Demo: Yoda Stories", YodaDemo, Settings.url.yodaDemo],
			["Indiana Jones and his Desktop Adventures", Indy, Settings.url.indy],
			["Demo: Indiana Jones and his Desktop Adventures", IndyDemo, Settings.url.indyDemo],
			["The Construct", YodaDemo, Settings.url.theConstruct]
		];
		games.forEach(([name, type, urls]) => {
			document.body.appendChild(
				<a onclick={() => this.load(type, urls)}>
					Load <i>{name}</i>
				</a>
			);
			document.body.appendChild(<br></br>);
		});
	}

	private ensureAddressbarCanBeHidden(): void {
		if (!this.settings.mobile) return;
		if (this.settings.pwa) return;

		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}

	private load(type: Variant, urls: any): void {
		const controller = new GameController(type, urls);
		controller.newStory();
		controller.show(this.windowManager);
	}
}

export default App;
