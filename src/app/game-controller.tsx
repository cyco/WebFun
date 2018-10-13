import {
	CanvasRenderer,
	Engine,
	GameData,
	Hero,
	Inventory,
	Metronome,
	Story,
	TileSheetCanvasRenderer,
	ColorPalette,
	SaveState
} from "src/engine";
import { Reader } from "src/engine/save-game";
import { DesktopInputManager } from "src/engine/input";
import { Char, Zone } from "src/engine/objects";
import { ZoneScene } from "src/engine/scenes";
import { ScriptExecutor } from "src/engine/script";
import { Planet, WorldSize } from "src/engine/types";
import Settings from "src/settings";
import { FilePicker, WindowManager } from "src/ui";
import { EventTarget } from "src/util";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import GameState from "../engine/game-state";
import Loader, { LoaderEventDetails } from "./loader";
import { LoadingView, SceneView } from "./ui";
import { MainMenu, MainWindow } from "./windows";
export const Event = {
	DidLoadData: "didLoadData"
};

class GameController extends EventTarget {
	public static readonly Event = Event;
	public settings: typeof Settings = Settings;
	public data: GameData;
	public palette: ColorPalette;
	private _window: MainWindow = <MainWindow menu={new MainMenu(this)} /> as MainWindow;
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

	public show(windowManager: WindowManager = WindowManager.defaultManager) {
		windowManager.showWindow(this._window);

		if (!this._window.x && !this._window.y) {
			this._window.center();
		}
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

		await this._loadGameData();
		const story = new Story(0x0000, Planet.ENDOR, WorldSize.Large);
		this._engine.inventory.removeAllItems();
		story.generateWorld(this._engine);
		this._engine.story = story;

		this._showSceneView();
	}

	public async replayStory() {
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

		const stream = await this.pickSaveGame();
		if (!stream) return;
		const { read } = Reader.build(stream);
		read(this.data);
	}

	private async pickSaveGame() {
		const filePicker = new FilePicker();
		filePicker.allowedTypes = ["*.wld"];
		filePicker.allowsMultipleFiles = false;
		const [file] = await filePicker.pickFile();
		if (!file) return null;
		if (!file.name.endsWith(".wld")) return null;

		return await file.provideInputStream();
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

	private _loadGameData(): Promise<void> {
		return new Promise((resolve, reject) => {
			const loadingView = <LoadingView /> as LoadingView;
			const windowContent = this._window.mainContent;
			windowContent.textContent = "";
			windowContent.appendChild(loadingView);

			const loader = new Loader();
			loader.onfail = event => reject(event);
			loader.onprogress = ({ detail: { progress } }) => (loadingView.progress = progress);
			loader.onloadsetupimage = ({ detail: { pixels, palette } }) => {
				loadingView.palette = palette;
				loadingView.image = pixels;
			};
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

	public get engine() {
		return this._engine;
	}
}

export default GameController;
