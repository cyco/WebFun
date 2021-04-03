import "./app.scss";

import Settings from "src/settings";
import { Indy, IndyDemo, Yoda, YodaDemo } from "src/variant";
import { Variant } from "src/engine";
import { WindowManager } from "src/ui";
import { GlobalFileDrop } from "src/ux";
import GameController, { PathConfiguration } from "./game-controller";
import { EventTarget } from "src/util";
import { navigator } from "src/std/dom";

class App {
	public static sharedApp: App;
	public readonly settings: Settings & EventTarget;
	private root: HTMLElement;
	private defaultGameController: GameController;
	private _windowManager: WindowManager;

	public constructor(container: HTMLElement, settings: Settings & EventTarget) {
		this.root = container;
		this.settings = settings;
		this._windowManager = new WindowManager(container);
		App.sharedApp = this;
	}

	public run(): void {
		this.endPreload();
		this.registerServiceWorker();
		this.setupSaveGameFileHandler();
		this.setupTestFileHandler();
		this.createDebugGameLinks();
		this.ensureAddressbarCanBeHidden();
	}

	private endPreload() {
		this.root.classList.add("webfun");
		this.root.classList.remove("preload");
		this.root.textContent = "";
	}

	private registerServiceWorker(): void {
		if (!("serviceWorker" in navigator)) {
			console.log("[ServiceWorkerClient]", "Service workers are not supported");
			return;
		}

		if (process.env.WEBPACK_MODE !== "production") {
			console.log("[ServiceWorkerClient]", "Skipping registration in development mode");
			return;
		}

		navigator.serviceWorker
			.register(process.env.SWURL, { scope: "./" })
			.then((reg: ServiceWorkerRegistration) => {
				console.log("[ServiceWorkerClient]", "Service worker registration succeeded.", reg);
			})
			.catch((error: any) => {
				console.log("[ServiceWorkerClient]", "Service worker registration failed:", error);
			});
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

	private createDebugGameLinks(): void {
		const games = this.loadGamesFromEnvironment();
		if (!games.length) return;

		const container = <div className="sources" />;
		games.forEach(([name, type, urls]) => {
			container.appendChild(
				<a onclick={() => this.load(type, urls).then(c => c.newStory())}>{name} </a>
			);
			container.appendChild(<br></br>);
		});
		this.root.appendChild(container);
	}

	private loadGamesFromEnvironment(): [string, Variant, PathConfiguration][] {
		const games: [string, Variant, PathConfiguration][] = [];
		for (const config of JSON.parse(process.env["WEBFUN_GAMES"])) {
			games.push([
				config.title,
				this.resolveVariantFromEnvironment(config.variant),
				{
					data: config.data,
					sfx: config.sfx,
					sfxFormat: config["sfx-format"],
					help: config.help,
					exe: config.exe
				}
			]);
		}

		return games;
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
		const controller = new GameController(variant, urls, this.settings);
		await controller.show(this._windowManager);

		//if (!this.defaultGameController) this.defaultGameController = controller;
		return controller;
	}

	public get windowManager(): WindowManager {
		return this.windowManager;
	}
}
export default App;
