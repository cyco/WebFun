import { Settings } from "src";
import { Indy, IndyDemo, Yoda, YodaDemo } from "src/variant";
import { Variant } from "src/engine";
import { WindowManager } from "src/ui";
import { GlobalFileDrop } from "src/ux";
import GameController from "./game-controller";

class App {
	private settings = Settings;
	private defaultGameController: GameController;
	private windowManager: WindowManager;
	private root: HTMLElement;

	public constructor(container: HTMLElement) {
		this.root = container;
		this.windowManager = new WindowManager(container);
	}

	public run(): void {
		this.endPreload();
		this.setupSaveGameFileHandler();
		this.setupTestFileHandler();
		//this.showDefaultGameController();
		this.createLinks();
		this.ensureAddressbarCanBeHidden();
	}

	private endPreload() {
		this.root.classList.add("webfun");
		this.root.classList.remove("preload");
		this.root.textContent = "";
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
			["Yoda Stories (🇺🇸)", Yoda, Settings.url.yoda],
			["Yoda Stories (🇪🇸)", Yoda, Settings.url["yoda-es"]],
			["Yoda Stories (🇩🇪)", Yoda, Settings.url["yoda-de"]],
			["Demo: Yoda Stories", YodaDemo, Settings.url["yoda-demo"]],
			["Indiana Jones and his Desktop Adventures (🇺🇸)", Indy, Settings.url.indy],
			["Indiana Jones and his Desktop Adventures (🇪🇸)", Indy, Settings.url["indy-es"]],
			["Indiana Jones and his Desktop Adventures (🇫🇷)", Indy, Settings.url["indy-fr"]],
			["Demo: Indiana Jones and his Desktop Adventures", IndyDemo, Settings.url["indy-demo"]],
			["The Construct", YodaDemo, Settings.url["the-construct"]]
		];
		games.forEach(([name, type, urls]) => {
			this.root.appendChild(
				<a onclick={() => this.load(type, urls).then(c => c.newStory())}>
					Load <i>{name}</i>
				</a>
			);
			this.root.appendChild(<br></br>);
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
