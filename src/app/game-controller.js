import { dispatch } from "/util";
import { LoadingView, SceneView } from "./ui";
import Settings from '/settings';
import { MainWindow, MainMenu } from "./windows";
import { Engine, CanvasRenderer, WebGLRenderer, Story, Metronome, Hero, Inventory } from "/engine";
import { Planet, WorldSize } from "/engine/types";
import { ZoneScene } from '/engine/scenes';
import { DesktopInputManager } from '/engine/input';
import Loader from "./loader";
import { ScriptExecutor } from '/engine/script';
import { WorldGeneration, Debugger } from '/debug';

export default class {
	constructor() {
		this._window = null;
		this._sceneView = new SceneView();
		this._engine = this._buildEngine();
		this._sceneView.manager.engine = this._engine;
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
		window.engine = engine;

		return engine;
	}

	_determineRenderer() {
		if(WebGLRenderer.isSupported()) {
			return WebGLRenderer;
		}

		return CanvasRenderer;
	}

	start() {
		this._window = document.createElement(MainWindow.TagName);
		this._window.menu = new MainMenu(this);

		this._load();

		document.body.appendChild(this._window);
		this._window.center();
	}

	_load() {
		const loadingView = new LoadingView();
		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(loadingView.element);

		const loader = new Loader();
		loader.onfail = (event) => console.log("fail", event);
		loader.onprogress = ({ detail: { progress } }) => loadingView.progress = progress;
		loader.onloadsetupimage = ({ detail: { setupImage } }) => loadingView.backgroundImageSource = setupImage.representation.src;
		loader.onload = () => {
			loadingView.progress = 1.0;
			dispatch(() => this.newStory(), 3000);
		};
		loader.load(this._engine);
	}

	newStory() {
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
		engine.metronome.ontick = (delta) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		const loadingZone = engine.data.zones.find(z => z.isLoadingZone());
		const zoneScene = new ZoneScene();
		zoneScene.zone = loadingZone;
		engine.currentZone = loadingZone;
		engine.hero.appearance = engine.data.characters.find(c => c.isHero());

		engine.sceneManager.clear();
		engine.sceneManager.pushScene(zoneScene);

		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(this._sceneView.element);

		engine.inputManager.addListeners();
		this._window.engine = engine;

		if(Settings.autostartEngine) {
			engine.metronome.start();
		}
	}
}
