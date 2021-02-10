import { Inventory as InventoryComponent, ErrorView, LoadingView, SceneView } from "./ui";
import { Char, Tile, Zone, Sound, Puzzle } from "src/engine/objects";
import {
	ColorPalette,
	Engine,
	GameData,
	Hero,
	AssetManager,
	Variant,
	Interface,
	PaletteAnimation
} from "src/engine";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import { EventTarget, srand } from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import { ZoneScene } from "src/engine/scenes";
import { MainMenu, MobileMainMenu, MainWindow } from "./windows";
import GameState from "src/engine/game-state";
import { Reader } from "src/engine/save-game";
import Settings from "src/settings";
import { CanvasRenderer } from "./rendering";
import { InputManager } from "./input";
import Loader from "./loader";
import ResourceManager from "./resource-manager";
import CursorManager from "./input/cursor-manager";
import { Mixer } from "./audio";
import DebugInfoScene from "src/app/webfun/debug/debug-info-scene";
import { OnscreenPad, OnscreenButton } from "./ui";
import { random, floor } from "src/std/math";
import * as SmartPhone from "detect-mobile-browser";
import GameEventHandler from "./game-event-handler";
import Logger from "./logger";

export const Event = {
	DidLoadData: "didLoadData"
};

interface PathConfiguration {
	data: string;
	palette: string;
	sfx: string;
}

class GameController extends EventTarget implements EventListenerObject {
	public static readonly Event = Event;
	public settings: typeof Settings = Settings;
	public data: GameData;
	public palette: ColorPalette;
	private _window: MainWindow;
	private _sceneView: SceneView = (<SceneView />) as SceneView;
	private _engine: Engine;
	private _eventHandler = new GameEventHandler();

	constructor(type: Variant, paths: PathConfiguration) {
		super();

		this.settings.mobile = !!(SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone());
		const mainMenuClass = this.settings.mobile ? MobileMainMenu : MainMenu;
		this._window = (
			<MainWindow menu={new mainMenuClass(this)} className={this.settings.mobile ? "mobile" : ""} />
		) as MainWindow;

		if (SmartPhone(false).isIPad()) {
		}

		this._engine = this._buildEngine(type, paths);
		this._sceneView.manager.engine = this._engine;
		if (this.settings.debug) (window as any).engine = this._engine;
		if (this.settings.mobile) this._window.classList.add("mobile");
	}

	private _buildEngine(type: Variant, paths: PathConfiguration) {
		const engine: Engine = new Engine(type, this._buildInterface(paths));
		engine.hero.addEventListener(Hero.Event.HealthDidChange, this);

		if (this.settings.drawDebugStats) {
			engine.sceneManager.addOverlay(new DebugInfoScene());
		}

		return engine;
	}

	handleEvent(evt: CustomEvent): void {
		this._eventHandler.handleEvent(this.engine, this._sceneView, evt);
	}

	private _buildInterface(paths: any): Partial<Interface> {
		const mixer = new Mixer(this.settings);
		const renderer = new CanvasRenderer.Renderer(this._sceneView.canvas);
		const inputManager = new InputManager(
			this._sceneView,
			new CursorManager(this._sceneView),
			this._window.content.querySelector(OnscreenPad.tagName),
			this._window.content.querySelector(`${OnscreenButton.tagName}.shoot`),
			this._window.content.querySelector(`${OnscreenButton.tagName}.drag`)
		);
		const resources = new ResourceManager(paths.palette, paths.data, paths.sfx);
		const logger = new Logger(console);

		return {
			Renderer: () => renderer,
			InputManager: () => inputManager,
			SceneManager: () => this._sceneView.manager,
			ResourceManager: () => resources,
			Mixer: () => mixer,
			Logger: () => logger
		};
	}

	public show(windowManager: WindowManager = WindowManager.defaultManager): void {
		windowManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
	}

	public async newStory(): Promise<void> {
		try {
			const gameState = this.engine.gameState;
			if (
				gameState === GameState.Running &&
				(await ModalConfirm(
					"This command will discard the current world.\nBuild a new world anyway?"
				)) !== ConfirmationResult.Confirmed
			) {
				return;
			}

			srand(floor(random() * 0xffff));
			await this._loadGameData();
			const story = this.engine.variant.createNewStory(this.engine);

			this._engine.inventory.removeAllItems();
			story.generateWorld(this._engine.assets, this._engine.variant, 10);
			this._engine.story = story;

			this._showSceneView();
			this._engine.gameState = GameState.Running;
		} catch (error) {
			this.presentView(<ErrorView error={error}></ErrorView>);
		}
	}

	public async replayStory(): Promise<void> {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nReplay anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}
	}

	public async load(file: File = null): Promise<void> {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nLoad anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}

		const stream = await this.pickSaveGame(file);
		if (!stream) return;
		const { read } = Reader.build(stream);

		await this.engine.metronome.stop();
		const assets = new AssetManager();
		this.populateAssetManager(assets);
		const state = read(assets);
		console.log("state", state);
	}

	private populateAssetManager(manager: AssetManager) {
		manager.populate(Zone, this.data.zones);
		manager.populate(Tile, this.data.tiles);
		manager.populate(Puzzle, this.data.puzzles);
		manager.populate(Char, this.data.characters);
		manager.populate(Sound, this.data.sounds);
	}

	private async pickSaveGame(file: File = null) {
		if (!file) {
			const filePicker = new FilePicker();
			filePicker.allowedTypes = ["*.wld"];
			filePicker.allowsMultipleFiles = false;
			[file] = await filePicker.pickFile();
		}
		if (!file) return null;
		if (!file.name.endsWith(".wld")) return null;

		return await file.provideInputStream();
	}

	public async save(): Promise<void> {
		console.log("Save");
	}

	private _showSceneView(zone: Zone = this._engine.assets.find(Zone, z => z.isLoadingZone())) {
		this._window.inventory.removeEventListener(InventoryComponent.Events.ItemActivated, this);
		this._window.inventory.removeEventListener(InventoryComponent.Events.ItemPlaced, this);

		const engine = this._engine;
		engine.metronome.stop();
		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		engine.palette = new PaletteAnimation(this.palette);

		const zoneScene = new ZoneScene();
		zoneScene.engine = engine;
		zoneScene.zone = zone;
		engine.currentZone = zone;
		engine.currentWorld = engine.world.findLocationOfZone(zone) ? engine.world : engine.dagobah;
		engine.hero.appearance = engine.assets.find(Char, (c: Char) => c.isHero());

		engine.sceneManager.clear();
		engine.sceneManager.pushScene(zoneScene);

		this.presentView(this._sceneView);

		engine.inputManager.engine = engine;
		engine.inputManager.addListeners();
		this._window.inventory.addEventListener(InventoryComponent.Events.ItemActivated, this);
		this._window.inventory.addEventListener(InventoryComponent.Events.ItemPlaced, this);
		this._window.engine = engine;

		if (this.settings.autostartEngine) {
			engine.metronome.start();
		}
	}

	private _loadGameData(): Promise<void> {
		return new Promise((resolve, reject) => {
			const loadingView: LoadingView = <LoadingView />;
			this.presentView(loadingView);

			const engine = this.engine;
			const loader = new Loader(engine.resources, engine.mixer as Mixer, this.engine.variant);
			loader.onfail = event => reject(event);
			loader.onprogress = ({ detail: { progress } }) => (loadingView.progress = progress);
			loader.onloadpalette = ({ detail: { palette } }) => {
				this.palette = palette;
				this._window.inventory.palette = palette;
				this._window.weapon.palette = palette;
				loadingView.palette = palette;
			};
			loader.onloadsetupimage = ({ detail: { pixels } }) => {
				loadingView.image = pixels;
			};

			loader.onload = ({ detail: { data } }) => {
				loadingView.progress = 1.0;
				this.data = data;

				this.populateAssetManager(this._engine.assets);

				this.dispatchEvent(
					new CustomEvent(Event.DidLoadData, {
						detail: {
							data: this.data,
							palette: this.palette
						}
					})
				);

				resolve();
			};
			loader.load();
		});
	}

	private presentView(view: Element): void {
		const windowContent = this._window.mainContent;
		windowContent.textContent = "";
		windowContent.appendChild(view);
	}

	public jumpStartEngine(zone: Zone): void {
		this._showSceneView(zone);
		this._window.inventory.palette = this.palette;
		this._window.engine = this.engine;
	}

	public get engine(): Engine {
		return this._engine;
	}

	public async stop(): Promise<void> {
		await this._engine.metronome.stop();
		if ((window as any).engine === this._engine) (window as any).engine = null;
		this._window.close();
	}
}

export default GameController;
