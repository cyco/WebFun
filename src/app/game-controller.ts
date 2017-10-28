import {
	CanvasRenderer,
	Engine,
	GameData,
	Hero,
	Inventory,
	Metronome,
	SaveGameReader,
	Story,
	WebGLRenderer
} from "src/engine";
import { DesktopInputManager } from "src/engine/input";
import { Char, Zone } from "src/engine/objects";
import { ZoneScene } from "src/engine/scenes";
import { ScriptExecutor } from "src/engine/script";
import { Planet, WorldSize } from "src/engine/types";
import Settings from "src/settings";
import { FilePicker, WindowManager } from "src/ui";
import { InputStream } from "src/util";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import GameState from "../engine/game-state";
import Loader, { LoaderEventDetails } from "./loader";
import { LoadingView, SceneView } from "./ui";
import { MainMenu, MainWindow } from "./windows";
import { ScriptDebugger } from "src/debug";

class GameController {
	private _window: MainWindow;
	private _sceneView: SceneView;
	private _engine: Engine;

	private _data: GameData;
	private _palette: Uint8Array;

	constructor() {
		this._sceneView = <SceneView>document.createElement(SceneView.TagName);
		this._engine = this._buildEngine();
		this._sceneView.manager.engine = this._engine;

		this._data = null;
	}

	get engine() {
		return this._engine;
	}

	_buildEngine() {
		const engine = new Engine();
		const renderer = this._determineRenderer();

		engine.renderer = new (<any>renderer)(this._sceneView.canvas);
		engine.imageFactory = engine.renderer.imageFactory;
		engine.sceneManager = this._sceneView.manager;
		engine.inputManager = new DesktopInputManager(this._sceneView);
		engine.metronome = new Metronome();
		engine.inventory = new Inventory();
		engine.scriptExecutor = new ScriptExecutor();
		engine.hero = new Hero();

		return engine;
	}

	_determineRenderer(): typeof WebGLRenderer|typeof CanvasRenderer {
		if (WebGLRenderer.isSupported() && Settings.allowWebGL) {
			console.log("Using WebGL renderer");
			return WebGLRenderer;
		}

		console.log("Using Canvas renderer");
		return CanvasRenderer;
	}

	start() {
		this._window = <MainWindow>document.createElement(MainWindow.TagName);
		this._window.menu = new MainMenu(this);

		this._load();

		if (Settings.debug) {
			ScriptDebugger.sharedDebugger.engine = this._engine;
		}

		WindowManager.defaultManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
	}

	_load() {
		const loadingView = <LoadingView>document.createElement(LoadingView.TagName);
		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(loadingView);

		const loader = new Loader();
		loader.onfail = (event) => console.log("fail", event);
		loader.onprogress = ({detail: {progress}}) => loadingView.progress = progress;
		loader.onloadsetupimage = ({detail: {pixels, palette}}) => loadingView.showImage(pixels, palette);
		loader.onload = (e) => {
			const details = e.detail as LoaderEventDetails;
			loadingView.progress = 1.0;
			this._data = details.data;
			this._palette = details.palette;
			this._engine.data = this._data;
		};
		loader.load(this._engine.imageFactory);
	}

	async newStory() {
		const gameState = this.engine.gameState;
		if (gameState === GameState.Running && await ModalConfirm("This command will discard the current world.\nBuild a new world anyway?") !== ConfirmationResult.Confirmed) {
			return;
		}

		const story = new Story(0x0000, Planet.ENDOR, WorldSize.Large);
		this._engine.inventory.removeAllItems();
		await story.generateWorld(this._engine);
		this._engine.story = story;

		this._showSceneView();
	}

	async replayStory() {
		console.log("Replay Story");
		const gameState = this.engine.gameState;
		if (gameState === GameState.Running && await ModalConfirm("This command will discard the current world.\nReplay anyway?") !== ConfirmationResult.Confirmed) {
			return;
		}
	}

	async load() {
		const gameState = this.engine.gameState;
		if (gameState === GameState.Running && await ModalConfirm("This command will discard the current world.\nLoad anyway?") !== ConfirmationResult.Confirmed) {
			return;
		}

		const filePicker = new FilePicker();
		filePicker.allowedTypes = ["*.wld"];
		filePicker.allowsMultipleFiles = false;
		const [file] = await filePicker.pickFile();
		if (!file) return;
		if (!file.name.endsWith(".wld")) return;

		const readFile = async (file: File) => {
			return new Promise<InputStream>((resolve) => {
				const fileReader = new FileReader();
				fileReader.onload = (e: any) => resolve(new InputStream(e.target.result));
				fileReader.readAsArrayBuffer(file);
			});
		};
		const stream = await readFile(file);
		const reader = new SaveGameReader(this._data);
		const state = reader.read(stream);
		console.log("state: ", state);
	}

	async save() {
		console.log("Save");
	}

	isGameInProgress() {
		return false;
	}

	isDataLoaded() {
		return this._data !== null;
	}

	_showSceneView() {
		const engine = this._engine;
		engine.metronome.stop();
		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		const loadingZone = engine.data.zones.find((z: Zone) => z.isLoadingZone());
		const zoneScene = new ZoneScene();
		zoneScene.zone = loadingZone;
		engine.currentZone = loadingZone;
		engine.hero.appearance = engine.data.characters.find((c: Char) => c.isHero());

		engine.sceneManager.clear();
		engine.sceneManager.pushScene(zoneScene);

		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(this._sceneView);

		engine.inputManager.addListeners();
		this._window.engine = engine;

		if (Settings.autostartEngine) {
			engine.metronome.start();
		}
	}
}

export default GameController;
