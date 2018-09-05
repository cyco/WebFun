import {
	CanvasRenderer,
	Engine,
	GameData,
	Hero,
	Inventory,
	Metronome,
	Story,
	TileSheetCanvasRenderer,
	ColorPalette
} from "src/engine";
import { Reader } from "src/engine/save-game";
import { DesktopInputManager } from "src/engine/input";
import { Char, Zone } from "src/engine/objects";
import { ZoneScene } from "src/engine/scenes";
import { ScriptExecutor } from "src/engine/script";
import { Planet, WorldSize } from "src/engine/types";
import Settings from "src/settings";
import { FilePicker, WindowManager } from "src/ui";
import { EventTarget, Point } from "src/util";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import GameState from "../engine/game-state";
import Loader, { LoaderEventDetails } from "./loader";
import { LoadingView, SceneView } from "./ui";
import { MainMenu, MainWindow } from "./windows";
import { ScriptDebugger } from "src/debug";
import { global } from "src/std";

export const Event = {
	DidLoadData: "didLoadData"
};

class GameController extends EventTarget {
	public static readonly Event = Event;
	public settings: typeof Settings = Settings;
	public data: GameData;
	public palette: ColorPalette;

	private _window: MainWindow;
	private _windowManager: WindowManager;
	private _sceneView: SceneView = <SceneView /> as SceneView;
	private _engine: Engine;

	constructor() {
		super();

		this._engine = this._buildEngine();
		this._sceneView.manager.engine = this._engine;
	}

	private _buildEngine() {
		const engine = new Engine();
		const Renderer = this._determineRenderer();

		engine.renderer = new Renderer(this._sceneView.canvas);
		engine.imageFactory = engine.renderer.imageFactory;
		engine.sceneManager = this._sceneView.manager;
		engine.inputManager = new DesktopInputManager(this._sceneView);
		engine.metronome = new Metronome();
		engine.inventory = new Inventory();
		engine.scriptExecutor = new ScriptExecutor();
		engine.hero = new Hero();

		return engine;
	}

	private _determineRenderer(): typeof CanvasRenderer | typeof TileSheetCanvasRenderer {
		if (Settings.allowTileSheet) {
			return TileSheetCanvasRenderer;
		}

		return CanvasRenderer;
	}

	public async start(story?: Story) {
		this._window = <MainWindow menu={new MainMenu(this)} /> as MainWindow;

		const loading = this._load();

		if (Settings.debug) {
			ScriptDebugger.sharedDebugger.engine = this._engine;
		}

		this.windowManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}

		if (story) {
			await loading;

			this._engine.inventory.removeAllItems();
			story.generateWorld(this._engine);
			this._engine.story = story;
			this._engine.currentWorld = story.world;
			this._engine.hero.visible = true;
			this._engine.temporaryState.worldLocation = new Point(5, 4);
			this._showSceneView(story.world.at(5, 4).zone);

			(global as any).engine = this._engine;
		}
	}

	private _load(): Promise<void> {
		return new Promise((resolve, reject) => {
			const loadingView = <LoadingView /> as LoadingView;
			const windowContent = this._window.mainContent;
			windowContent.textContent = "";
			windowContent.appendChild(loadingView);

			const loader = new Loader();
			loader.onfail = event => reject(event);
			loader.onprogress = ({ detail: { progress } }) => (loadingView.progress = progress);
			loader.onloadsetupimage = ({ detail: { pixels, palette } }) =>
				loadingView.showImage(pixels, palette);
			loader.onload = e => {
				const details = e.detail as LoaderEventDetails;
				loadingView.progress = 1.0;
				this.data = details.data;
				this.palette = details.palette;
				this._engine.data = this.data;

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
			loader.load(this._engine.imageFactory);
		});
	}

	public async newStory() {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm(
				"This command will discard the current world.\nBuild a new world anyway?"
			)) !== ConfirmationResult.Confirmed
		) {
			return;
		}

		const story = new Story(0x0000, Planet.ENDOR, WorldSize.Large);
		this._engine.inventory.removeAllItems();
		story.generateWorld(this._engine);
		this._engine.story = story;

		this._showSceneView();
	}

	public async replayStory() {
		console.log("Replay Story");
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nReplay anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}
	}

	public async load() {
		const gameState = this.engine.gameState;
		if (
			gameState === GameState.Running &&
			(await ModalConfirm("This command will discard the current world.\nLoad anyway?")) !==
				ConfirmationResult.Confirmed
		) {
			return;
		}

		const filePicker = new FilePicker();
		filePicker.allowedTypes = ["*.wld"];
		filePicker.allowsMultipleFiles = false;
		const [file] = await filePicker.pickFile();
		if (!file) return;
		if (!file.name.endsWith(".wld")) return;

		const stream = await file.provideInputStream();
		const { read } = Reader.build(stream);
		read(this.data);
	}

	public async save() {
		console.log("Save");
	}

	private _showSceneView(zone: Zone = this._engine.data.zones.find(z => z.isLoadingZone())) {
		const engine = this._engine;
		engine.metronome.stop();
		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		const zoneScene = new ZoneScene();
		zoneScene.zone = zone;
		engine.currentZone = zone;
		engine.currentWorld = engine.world.locationOfZone(zone) ? engine.world : null;
		engine.hero.appearance = engine.data.characters.find((c: Char) => c.isHero());

		engine.sceneManager.clear();
		engine.sceneManager.pushScene(zoneScene);

		const windowContent = this._window.mainContent;
		windowContent.textContent = "";
		windowContent.appendChild(this._sceneView);

		engine.inputManager.addListeners();
		this._window.engine = engine;

		if (this.settings.autostartEngine) {
			engine.metronome.start();
		}
	}

	public get engine() {
		return this._engine;
	}

	public set windowManager(w: WindowManager) {
		this._windowManager = w;
	}

	public get windowManager() {
		return this._windowManager || WindowManager.defaultManager;
	}
}

export default GameController;
