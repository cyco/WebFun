import { Settings } from "src";
import { Indy, IndyDemo, Yoda, YodaDemo } from "src/variant";
import { Variant } from "src/engine";
import { WindowManager } from "src/ui";
import { GlobalFileDrop } from "src/ux";
import GameController, { PathConfiguration } from "./game-controller";

class App {
	public static sharedApp: App;
	private settings = Settings;
	private defaultGameController: GameController;
	private _windowManager: WindowManager;
	private root: HTMLElement;

	public constructor(container: HTMLElement) {
		this.root = container;
		this._windowManager = new WindowManager(container);
		App.sharedApp = this;
	}

	public run(): void {
		this.endPreload();
		this.setupSaveGameFileHandler();
		this.setupTestFileHandler();
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
		//if (!this.defaultGameController) await this.showDefaultGameController();
		//this.showDefaultGameController();
		loadFile.default(this.defaultGameController)(file);
	}

	private createLinks(): void {
		const games: [string, Variant, PathConfiguration][] = [];
		for (const config of JSON.parse(process.env["WEBFUN_GAMES"])) {
			games.push([
				config.title,
				this.resolveVariantFromEnvironment(config.variant),
				{
					data: config.data,
					sfx: config.sfx,
					help: config.help,
					strings: config.strings,
					palette: config.palette
				}
			]);
		}

		games.forEach(([name, type, urls]) => {
			this.root.appendChild(
				<a onclick={() => this.load(type, urls).then(c => c.newStory())}>
					Load <i>{name}</i>
				</a>
			);
			this.root.appendChild(<br></br>);
		});
	}

	private resolveVariantFromEnvironment(name: string): Variant {
		switch (name) {
			case "indy":
				return Indy;
			case "indy-demo":
				return IndyDemo;
			case "yoda":
				return Yoda;
			case "yoda-demo":
				return YodaDemo;
			default:
				throw new Error(`Invalid game variant "${name}" specified`);
		}
	}

	private ensureAddressbarCanBeHidden(): void {
		if (!this.settings.mobile) return;
		if (this.settings.pwa) return;

		document.body.style.height = "120vh";
		setTimeout(() => (window.document.scrollingElement.scrollTop = 0));
	}

	private async load(variant: Variant, urls: any): Promise<GameController> {
		const controller = new GameController(variant, urls);
		await controller.show(this._windowManager);

		//if (!this.defaultGameController) this.defaultGameController = controller;
		return controller;
	}

	public get windowManager(): WindowManager {
		return this.windowManager;
	}
}
export default App;
