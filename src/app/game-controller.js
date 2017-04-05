import { dispatch } from "/util";
import { LoadingView, SceneView } from "./ui";
import { MainWindow, MainMenu } from "./windows";
import { Engine, CanvasRenderer, Story } from "/engine";
import { WorldGenerator } from "/engine/generation";
import { Planet, WorldSize } from "/engine/types";
import Loader from "./loader";

export default class {
	constructor() {
		this._window = null;
		this._sceneView = new SceneView();
		this._engine = this._buildEngine();
	}

	_buildEngine() {
		const engine = new Engine();

		const canvas = this._sceneView.canvas;
		engine.renderer = new CanvasRenderer.Renderer(canvas);
		engine.imageFactory = new CanvasRenderer.ImageFactory();

		return engine;
	}

	start() {
		this._window = new MainWindow();
		this._window.menu = new MainMenu(this);

		this._load();

		document.body.appendChild(this._window.element);
		this._window.center();
	}

	_load() {
		const loadingView = new LoadingView();
		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(loadingView.element);

		const loader = new Loader();
		loader.onfail = (event) => console.log("fail", event);
		loader.onprogress = ({detail: {progress}}) => loadingView.progress = progress;
		loader.onloadsetupimage = ({detail: {setupImage}}) => loadingView.backgroundImageSource = setupImage.representation.src;
		loader.onload = (event) => {
			loadingView.progress = 1.0;
			dispatch(() => this.newStory(), 3000);
		};
		loader.load(this._engine);
	}

	newStory() {
		const story = new Story(0x0000, Planet.ENDOR, WorldSize.LARGE);
		const worldGenerator = new WorldGenerator(story.seed, story.planet, story.size, this._engine);
		worldGenerator.generate();

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
		const windowContent = this._window.mainContent;
		windowContent.clear();
		windowContent.appendChild(this._sceneView.element);
	}
}
