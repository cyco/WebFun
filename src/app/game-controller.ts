import { dispatch } from "src/util";
import { LoadingView, SceneView } from "./ui";
import Settings from "src/settings";
import { MainMenu, MainWindow } from "./windows";
import { CanvasRenderer, Engine, Hero, Inventory, Metronome, Story, WebGLRenderer } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";
import { ZoneScene } from "src/engine/scenes";
import { DesktopInputManager } from "src/engine/input";
import Loader from "./loader";
import { ScriptExecutor } from "src/engine/script";
import { Debugger, WorldGeneration } from "src/debug";
import { Char, Zone } from "src/engine/objects";

class GameController {
	private _window: MainWindow;
	private _sceneView: SceneView;
	private _engine: Engine;
	private _startTime: number;

	constructor() {
		this._window = null;
		this._sceneView = new SceneView();
		this._engine = this._buildEngine();
		this._sceneView.manager.engine = this._engine;
		this._startTime = null;
	}

	_buildEngine() {
		const engine = new Engine();
		const renderer = this._determineRenderer();

		engine.renderer = new renderer(this._sceneView.canvas);
		engine.imageFactory = engine.renderer.imageFactory;
		engine.sceneManager = this._sceneView.manager;
		engine.inputManager = new DesktopInputManager(this._sceneView.element);
		engine.metronome = new Metronome();
		engine.inventory = new Inventory();
		engine.scriptExecutor = new ScriptExecutor();
		engine.hero = new Hero();

		return engine;
	}

	_determineRenderer() {
		if (WebGLRenderer.isSupported()) {
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

		document.body.appendChild(this._window);
		this._window.center();
	}

	_load() {
		this._startTime = performance.now();

		const loadingView = new LoadingView();
		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(loadingView.element);

		const loader = new Loader();
		loader.onfail = (event) => console.log("fail", event);
		loader.onprogress = ({detail: {progress}}) => loadingView.progress = progress;
		loader.onloadsetupimage = ({detail: {pixels, palette}}) => loadingView.showImage(pixels, palette);
		loader.onload = () => {
			loadingView.progress = 1.0;
			dispatch(() => this.newStory(), 0);
		};
		loader.load(this._engine);
	}

	newStory() {
		const duration = (performance.now() - this._startTime) / 1000;
		console.log(`Loading took ${duration.toFixed(4)}s`);
		if (Settings.debugWorldGeneration) {
			new WorldGeneration(this._engine);
		}

		if (Settings.debugActions) {
			new Debugger(this._engine);
		}

		const story = new Story(0x0000, Planet.ENDOR, WorldSize.LARGE);
		story.generateWorld(this._engine);
		this._engine.story = story;

		this._showSceneView();
	}

	replayStory() {
		console.log("Replay Story");
	}

	load() {
		console.log("Load");
	}

	save() {
		console.log("Save");
	}

	isGameInProgress() {
		return false;
	}

	isDataLoaded() {
		return false;
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
		windowContent.appendChild(this._sceneView.element);

		engine.inputManager.addListeners();
		this._window.engine = engine;

		if (Settings.autostartEngine) {
			engine.metronome.start();
		}
	}
}

export default GameController;
