import {
	Inventory as InventoryComponent,
	ErrorView,
	LoadingView,
	SceneView,
	CurrentStatusInfo
} from "./ui";
import { Char, Tile, Zone, Sound, Puzzle } from "src/engine/objects";
import {
	ColorPalette,
	Engine,
	GameData,
	Hero,
	AssetManager,
	Variant,
	Interface,
	PaletteAnimation,
	Story
} from "src/engine";
import { ConfirmationResult, ModalConfirm, ModalSession } from "src/ux";
import {
	DiscardingOutputStream,
	download,
	EventTarget,
	OutputStream,
	Point,
	PropertyChangeEvent,
	Rectangle,
	Size,
	srand
} from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import { MapScene, ZoneScene } from "src/engine/scenes";
import { MainMenu, MobileMainMenu, MainWindow } from "./windows";
import GameState from "src/engine/game-state";
import { Reader, Writer } from "src/engine/save-game";
import Settings from "src/settings";
import { CanvasRenderer } from "./rendering";
import { InputManager } from "./input";
import Loader from "./loader";
import ResourceManager from "./resource-manager";
import CursorManager from "./input/cursor-manager";
import { Mixer } from "./audio";
import DebugInfoScene from "src/app/webfun/debug/debug-info-scene";
import { OnscreenPad, OnscreenButton } from "./ui";
import { random, floor, min, max } from "src/std/math";
import * as SmartPhone from "detect-mobile-browser";
import GameEventHandler from "./game-event-handler";
import Logger from "./logger";
import { EvaluationMode } from "src/engine/script";
import { SpeechBubble } from "src/ui/components";
import Indy from "src/variant/indy/indy";
import { WorldSize } from "src/engine/generation";
import MutableStory from "../editor/mutable-story";
import { NullIfMissing } from "src/engine/asset-manager";
import { Yoda } from "src/variant";

export const Event = {
	DidLoadData: "didLoadData"
};

export interface GameSource {
	data: string;
	exe: string;
	sfx: string;
	variant: string;
	sfxFormat?: string;
	help?: string;
}

class GameController extends EventTarget implements EventListenerObject {
	public static readonly Event = Event;
	public settings: Settings & EventTarget;
	public data: GameData;
	public palette: ColorPalette;
	private _window: MainWindow;
	private _sceneView: SceneView = (<SceneView />) as SceneView;
	private _engine: Engine = null;
	private _eventHandler = new GameEventHandler();
	public readonly variant: Variant;
	public readonly gameSource: GameSource;

	constructor(variant: Variant, gameSource: GameSource, settings: Settings & EventTarget) {
		super();

		this.variant = variant;
		this.gameSource = gameSource;
		this.settings = settings;

		this.settings.mobile = !!(SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone());
		this._window = (<MainWindow className={this.settings.mobile ? "mobile" : ""} />) as MainWindow;
		this.setupMainMenu();
		if (this.settings.mobile) {
			this._window.classList.add("mobile");
			document.body.setAttribute("wf-fullscreen-game", "");
		}

		this.settings.addEventListener(PropertyChangeEvent.type, this);
	}

	handleEvent(evt: CustomEvent): void {
		if (
			evt.type === PropertyChangeEvent.type &&
			(evt.detail.property === "debug" || evt.detail.property === "mobile")
		) {
			this.setupMainMenu();
			return;
		}

		this._eventHandler.handleEvent(this.engine, this._sceneView, evt);
	}

	private setupMainMenu() {
		const mainMenuClass = this.settings.mobile ? MobileMainMenu : MainMenu;
		this._window.menu = new mainMenuClass(this, this.settings);
	}

	private _buildInterface(paths: GameSource): Partial<Interface> {
		const mixer = new Mixer(this.settings);
		const renderer = new CanvasRenderer.Renderer(this._sceneView.canvas);
		const inputManager = new InputManager(
			this._sceneView,
			new CursorManager(this._sceneView),
			this._window.content.querySelector(OnscreenPad.tagName),
			this._window.content.querySelector(`${OnscreenButton.tagName}.shoot`),
			this._window.content.querySelector(`${OnscreenButton.tagName}.drag`)
		);
		const resources = new ResourceManager(paths.exe, paths.data, paths.sfx, paths.sfxFormat);
		const logger = new Logger(console);

		return {
			Renderer: () => renderer,
			InputManager: () => inputManager,
			SceneManager: () => this._sceneView.manager,
			ResourceManager: () => resources,
			Mixer: () => mixer,
			Logger: () => logger,
			ShowText: (text: string, at: Point) => this.showText(text, at),
			ShowDebugStatusInfo: (engine: Engine) => {
				const window = document.createElement(CurrentStatusInfo.tagName);
				window.engine = engine;
				window.onclose = () => engine.metronome.start();

				engine.metronome.stop();
				this.window.manager.showWindow(window);
				window.center();
			}
		};
	}

	public async show(windowManager: WindowManager): Promise<void> {
		windowManager.showWindow(this._window);

		if (this.variant instanceof Indy) this._window.ammo.style.display = "none";
		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
	}

	private showText(text: string, at: Point): Promise<void> {
		return new Promise<void>(resolve => {
			const isMap = !!this.engine.sceneManager.stack.find(scene => scene instanceof MapScene);
			const offset = isMap ? new Point(4, 4) : new Point(0, 0);
			const tileSize = this._sceneView.effectiveTileSize.scaleBy(isMap ? 9 / 10 : 1);
			const maxSize = isMap ? new Size(10, 10) : new Size(9, 9);

			const modalSession = new ModalSession();
			modalSession.onend = () => resolve();

			const { left: windowX, top: windowY } = this._window.getBoundingClientRect();
			const { left: sceneX, top: sceneY } = this._sceneView.getBoundingClientRect();

			const attachBelow = at.y < 2;
			const offScreen = !new Rectangle(new Point(0, 0), maxSize).contains(at);

			at.x = min(max(0, at.x), maxSize.width);
			at.y = min(max(0, at.y), maxSize.height);

			const anchor = new Point(
				offset.x + at.x * tileSize.width + sceneX - windowX + tileSize.width / 2.0,
				offset.y +
					at.y * tileSize.height +
					sceneY -
					windowY +
					tileSize.height / 2.0 +
					(attachBelow ? 1 : -1) * (tileSize.height / 2 - 4)
			);

			const bubble = (
				<SpeechBubble
					text={text}
					onend={() => modalSession.end(0)}
					style={{ position: "absolute" }}
					arrowStyle={
						offScreen
							? SpeechBubble.ArrowStyle.None
							: attachBelow
							? SpeechBubble.ArrowStyle.Top
							: SpeechBubble.ArrowStyle.Bottom
					}
					origin={anchor}
				/>
			);

			modalSession.runForWindow(this._window);
			this._window.appendChild(bubble);
		});
	}

	public async newStory(): Promise<void> {
		try {
			if (
				this.engine?.gameState === GameState.Running &&
				(await ModalConfirm(
					"This command will discard the current world.\nBuild a new world anyway?"
				)) !== ConfirmationResult.Confirmed
			) {
				return;
			}

			await this.resetEngine();
			await this.loadGameData();

			srand(floor(random() * 0xffff));
			const story = this.engine.variant.createNewStory(this.engine);
			story.generateWorld(this._engine.assets, this._engine.variant, 10);
			this._engine.story = story;
			this._showSceneView();
		} catch (error) {
			this.presentView(<ErrorView error={error}></ErrorView>);
		}
	}

	public async replayStory(): Promise<void> {
		if (
			this.engine?.gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nReplay anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}

		const { seed, planet, size } = this.engine.story;
		await this.resetEngine();
		await this.loadGameData();

		srand(seed);
		const story = new Story(seed, planet, size);
		story.generateWorld(this._engine.assets, this._engine.variant, 10);
		this._engine.story = story;

		this._showSceneView();
	}

	public async resetEngine(): Promise<void> {
		await this.teardownEngine();
		this.setupEngine();
	}

	public async load(file: File = null): Promise<void> {
		if (
			this.engine?.gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nLoad anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}

		const stream = await this.pickSaveGame(file);
		if (!stream) return;
		const { read } = Reader.build(stream);

		await this.resetEngine();
		await this.loadGameData();

		const assets = new AssetManager();
		this.populateAssetManager(assets);
		const state = read(assets);
		// TODO: asset state matches engines variant

		const engine = this.engine;

		const story = new MutableStory(state.seed, state.planet, WorldSize.Medium);
		story.goal = assets.get(Puzzle, state.goalPuzzle);
		story.world = state.world;
		story.dagobah = state.dagobah;
		story.puzzles = [
			state.puzzleIDs1.mapArray(id => assets.get(Puzzle, id)),
			state.puzzleIDs2.mapArray(id => assets.get(Puzzle, id))
		];

		engine.story = story;
		engine.currentZone = assets.get(Zone, state.currentZoneID);
		engine.currentWorld = state.onDagobah ? engine.dagobah : engine.world;
		// TODO: engine.currentSector = engine.currentWorld.at(state.positionOnWorld);

		engine.inventory.removeAllItems();
		state.inventoryIDs.forEach(id => engine.inventory.addItem(assets.get(Tile, id)));
		engine.hero.location = state.positionOnZone;
		engine.hero.weapon = assets.get(Char, state.currentWeapon, NullIfMissing);
		engine.hero.setAmmoForWeapon(assets.get(Char, Yoda.charIDs.TheForce), state.forceAmmo);
		engine.hero.setAmmoForWeapon(assets.get(Char, Yoda.charIDs.Blaster), state.blasterAmmo);
		engine.hero.setAmmoForWeapon(
			assets.get(Char, Yoda.charIDs.BlasterRifle),
			state.blasterRifleAmmo
		);
		engine.hero.ammo = state.currentAmmo;
		engine.hero.health = Hero.ConvertDamageToHealth(state.damageTaken, state.livesLost);

		engine.totalPlayTime = state.timeElapsed;
		engine.currentPlayStart = new Date();

		// TODO: handle world size
		// TODO: handle unknownCount
		// TODO: handle unknownSum
		this._showSceneView(engine.currentZone);
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
		const engine = this.engine;
		const state = engine.variant.save(engine);
		const writer = new Writer(engine.assets);
		const sizingStream = new DiscardingOutputStream();
		writer.write(state, sizingStream);

		const stream = new OutputStream(sizingStream.offset);
		writer.write(state, stream);

		return download(stream.buffer, "savegame.wld");
	}

	public async exit(): Promise<void> {
		this.teardownEngine();
		this._window.close();
		this.settings.removeEventListener("propertyChanged", this);
		document.body.removeAttribute("wf-fullscreen-game");
	}

	private setupEngine() {
		const engine: Engine = new Engine(this.variant, this._buildInterface(this.gameSource));
		engine.settings = this.settings;
		engine.hero.addEventListener(Hero.Event.HealthDidChange, this);

		if (this.settings.drawDebugStats) {
			engine.sceneManager.addOverlay(new DebugInfoScene());
		}

		engine.camera.hero = engine.hero;
		this._sceneView.manager.engine = engine;
		this._window.engine = engine;
		this._engine = engine;

		if (this.settings.debug) (window as any).engine = this._engine;
	}

	private async teardownEngine(): Promise<void> {
		if (!this._engine) return;

		this._engine.hero.removeEventListener(Hero.Event.HealthDidChange, this);
		this._window.inventory.removeEventListener(InventoryComponent.Events.ItemActivated, this);
		this._window.inventory.removeEventListener(InventoryComponent.Events.ItemPlaced, this);
		this._window.engine = null;

		await this._engine.metronome.stop();
		this._engine.teardown();
		this._engine = null;
		this.data = null;

		this._sceneView.manager.clear();

		if ((window as any).engine === this._engine) (window as any).engine = null;
	}

	private populateAssetManager(manager: AssetManager) {
		manager.populate(Zone, this.data.zones);
		manager.populate(Tile, this.data.tiles);
		manager.populate(Puzzle, this.data.puzzles);
		manager.populate(Char, this.data.characters);
		manager.populate(Sound, this.data.sounds);
	}

	private _showSceneView(zone: Zone = this._engine.assets.find(Zone, z => z.isLoadingZone())) {
		const engine = this._engine;

		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();
		engine.palette = new PaletteAnimation(
			this.palette,
			engine.variant.fastColorCycles,
			engine.variant.slowColorCycles
		);

		const zoneScene = new ZoneScene();
		zoneScene.engine = engine;
		zoneScene.zone = zone;
		engine.currentZone = zone;
		engine.currentWorld = engine.world.findLocationOfZone(zone) ? engine.world : engine.dagobah;
		engine.hero.appearance = engine.assets.find(Char, (c: Char) => c.isHero());
		engine.spu.prepareExecution(EvaluationMode.JustEntered, zone);
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
		this._engine.gameState = GameState.Running;
	}

	public loadGameData(): Promise<void> {
		return new Promise((resolve, reject) => {
			const loadingView: LoadingView = <LoadingView />;
			this.presentView(loadingView);

			if (!this.engine) this.setupEngine();
			const engine = this.engine;

			const loader = new Loader(
				engine.resources,
				engine.mixer as Mixer,
				engine.variant,
				(...args: any[]) => console.log("[Loader]", ...args)
			);
			loader.onfail = event => reject(event);
			loader.onprogress = ({ detail: { progress } }) => (loadingView.progress = progress);
			loader.onloadsetupimage = ({ detail: { pixels, palette } }) => {
				loadingView.palette = palette;
				loadingView.image = pixels;

				this._window.inventory.palette = palette;
				this._window.weapon.palette = palette;

				this.palette = palette;
			};
			loader.onloadstrings = ({ detail: { strings } }) => {
				for (const [id, string] of Object.entries(strings)) {
					this.engine.assets.set(String, String(string), +id);
				}
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

	public async jumpStartEngine(zone: Zone): Promise<void> {
		this._showSceneView(zone);
	}

	public get engine(): Engine {
		return this._engine;
	}

	public get window(): MainWindow {
		return this._window;
	}
}

export default GameController;
