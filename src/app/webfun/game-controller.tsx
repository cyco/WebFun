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
	srand
} from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import { ZoneScene } from "src/engine/scenes";
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
import { random, floor } from "src/std/math";
import * as SmartPhone from "detect-mobile-browser";
import GameEventHandler from "./game-event-handler";
import Logger from "./logger";
import { EvaluationMode } from "src/engine/script";
import { SpeechBubble } from "src/ui/components";

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
	private _engine: Engine = null;
	private _eventHandler = new GameEventHandler();
	private _variant: Variant;
	private _paths: PathConfiguration;

	constructor(variant: Variant, paths: PathConfiguration) {
		super();

		this._variant = variant;
		this._paths = paths;

		this.settings.mobile = !!(SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone());
		const mainMenuClass = this.settings.mobile ? MobileMainMenu : MainMenu;
		this._window = (
			<MainWindow menu={new mainMenuClass(this)} className={this.settings.mobile ? "mobile" : ""} />
		) as MainWindow;

		if (this.settings.mobile) this._window.classList.add("mobile");
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
			Logger: () => logger,
			ShowText: (text: string, at: Point) => this.showText(text, at)
		};
	}

	public async show(windowManager: WindowManager = WindowManager.defaultManager): Promise<void> {
		windowManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
	}

	private showText(text: string, at: Point): Promise<void> {
		return new Promise<void>(resolve => {
			const modalSession = new ModalSession();
			modalSession.onend = () => resolve();

			const { left: windowX, top: windowY } = this._window.getBoundingClientRect();
			const { left: sceneX, top: sceneY } = this._sceneView.getBoundingClientRect();

			const attachBelow = at.y < 2;

			const anchor = new Point(
				at.x * Tile.WIDTH + sceneX - windowX + Tile.WIDTH / 2.0,
				at.y * Tile.HEIGHT +
					sceneY -
					windowY +
					Tile.HEIGHT / 2.0 +
					(attachBelow ? 1 : -1) * (Tile.HEIGHT / 2 - 4)
			);

			const bubble = (
				<SpeechBubble
					text={text}
					onend={() => modalSession.end(0)}
					style={{ position: "absolute" }}
					arrowStyle={!attachBelow ? SpeechBubble.ArrowStyle.Bottom : SpeechBubble.ArrowStyle.Top}
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
	}

	private setupEngine() {
		const engine: Engine = new Engine(this._variant, this._buildInterface(this._paths));
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
		engine.palette = new PaletteAnimation(this.palette);

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

			const loader = new Loader(engine.resources, engine.mixer as Mixer, engine.variant);
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
