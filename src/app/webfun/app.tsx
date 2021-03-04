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
		//this.showDefaultGameController();
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
		fileDrop.addHandler("wftest", (file: File) => this.loadTest(file));
		fileDrop.addHandler("fwftest", (file: File) => this.loadTest(file));
		fileDrop.addHandler("xwftest", (file: File) => this.loadTest(file));
	}

	private async loadTest(file: File): Promise<void> {
		const loadFile = await require("src/app/webfun/debug/load-test");
		if (!this.defaultGameController) await this.showDefaultGameController();
		loadFile.default(this.defaultGameController)(file);
	}

	private async showDefaultGameController(): Promise<GameController> {
		this.defaultGameController = new GameController(Yoda, this.settings.url.yoda);
		this.defaultGameController.show(this.windowManager);

		return this.defaultGameController;
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
				<a onclick={() => this.load(type, urls).then(c => c.newStory())}>
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

	private async load(variant: Variant, urls: any): Promise<GameController> {
		const controller = new GameController(variant, urls);
		await controller.show(this.windowManager);

		//if (!this.defaultGameController) this.defaultGameController = controller;
		return controller;
	}
}
export default App;
