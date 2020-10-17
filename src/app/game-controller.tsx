import { Inventory as InventoryComponent, LoadingView, SceneView } from "./ui";
import { Char, Tile, Zone, Sound, Puzzle } from "src/engine/objects";
import { ColorPalette, Engine, GameData, Hero, Story, AssetManager, GameType, Interface, PaletteAnimation } from "src/engine";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import { EventTarget, rand, srand } from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import { ZoneScene } from "src/engine/scenes";
import { MainMenu, MobileMainMenu, MainWindow } from "./windows";
import { Planet, WorldSize } from "src/engine/types";
import GameState from "../engine/game-state";
import { Reader } from "src/engine/save-game";
import Settings from "src/settings";
import { CanvasRenderer } from "./rendering";
import { InputManager } from "./input";
import Loader from "./loader";
import ResourceManager from "./resource-manager";
import CursorManager from "./input/cursor-manager";
import { Mixer } from "./audio";
import DebugInfoScene from "src/debug/debug-info-scene";
import { OnscreenPad, OnscreenButton } from "./ui";
import { random, floor } from "src/std/math";
import * as SmartPhone from "detect-mobile-browser";
import GameEventHandler from "./game-event-handler";

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

	constructor(type: GameType, paths: PathConfiguration) {
		super();

		this.settings.mobile = !!(SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone());
		const mainMenuClasss = this.settings.mobile ? MobileMainMenu : MainMenu;
		this._window = (<MainWindow menu={new mainMenuClasss(this)} className={this.settings.mobile ? "mobile" : ""} />) as MainWindow;

		if (SmartPhone(false).isIPad()) {
		}

		this._engine = this._buildEngine(type, paths);
		this._sceneView.manager.engine = this._engine;
		if (this.settings.debug) (window as any).engine = this._engine;
		if (this.settings.mobile) this._window.classList.add("mobile");
	}

	private _buildEngine(type: GameType, paths: PathConfiguration) {
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

		return {
			Renderer: () => renderer,
			InputManager: () => inputManager,
			SceneManager: () => this._sceneView.manager,
			ResourceManager: () => resources,
			Mixer: () => mixer
		};
	}

	public show(windowManager: WindowManager = WindowManager.defaultManager): void {
		windowManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
	}

	public async newStory(): Promise<void> {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nBuild a new world anyway?")) !== ConfirmationResult.Confirmed
		) {
			return;
		}

		srand(floor(random() * 0xffff));
		await this._loadGameData();
		const story = new Story(
			rand(),
			[Planet.Endor, Planet.Hoth, Planet.Tatooine].random(),
			[WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
		this._engine.inventory.removeAllItems();
		story.generateWorld(this._engine.assets, this.engine.persistentState.gamesWon);
		this._engine.story = story;

		this._showSceneView();
		this._engine.gameState = GameState.Running;
	}

	public async replayStory(): Promise<void> {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nReplay anyway?")) !== ConfirmationResult.Confirmed
		) {
			return;
		}
	}

	public async load(file: File = null): Promise<void> {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nLoad anyway?")) !== ConfirmationResult.Confirmed
		) {
			return;
		}

		const stream = await this.pickSaveGame(file);
		if (!stream) return;
		const { read } = Reader.build(stream);

		const assets = new AssetManager();
		this.populateAssetManager(assets);
		read(assets);
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

		const windowContent = this._window.mainContent;
		windowContent.textContent = "";
		windowContent.appendChild(this._sceneView);

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
			const loadingView = (<LoadingView />) as LoadingView;
			const windowContent = this._window.mainContent;
			windowContent.textContent = "";
			windowContent.appendChild(loadingView);

			const engine = this.engine;
			const loader = new Loader(engine.resources, engine.mixer as Mixer);
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

	public jumpStartEngine(zone: Zone): void {
		this._showSceneView(zone);
		this._window.inventory.palette = this.palette;
		this._window.engine = this.engine;
	}

	public get engine(): Engine {
		return this._engine;
	}
}

export default GameController;
