import {
	Ammo as AmmoComponet,
	Health as HealthComponent,
	Inventory as InventoryComponent,
	LoadingView,
	SceneView,
	Weapon as WeaponComponent
} from "./ui";
import { Char, Tile, Zone } from "src/engine/objects";
import { ColorPalette, Engine, GameData, Hero, Inventory, Metronome, Story } from "src/engine";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import { EventTarget, Point, Rectangle, Size } from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import Loader, { LoaderEventDetails } from "./loader";
import { LoseScene, ZoneScene } from "src/engine/scenes";
import { MainMenu, MainWindow } from "./windows";
import { Planet, WorldSize } from "src/engine/types";

import { CanvasRenderer } from "./rendering";
import { ConditionImplementations as Conditions } from "src/engine/script/conditions";
import { DOMAudioChannel } from "./audio";
import { DesktopInputManager } from "./input";
import GameState from "../engine/game-state";
import { GameTypeYoda } from "src/engine";
import { InstructionImplementations as Instructions } from "src/engine/script/instructions";
import { Mixer } from "src/engine/audio";
import { PaletteAnimation } from "src/engine/rendering";
import { Reader } from "src/engine/save-game";
import { ScriptExecutor } from "src/engine/script";
import Settings from "src/settings";
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
		if (Settings.debug) (window as any).engine = this._engine;
	}

	private _buildEngine() {
		const engine = new Engine(GameTypeYoda);
		const Renderer = this._determineRenderer();

		const effectsChannel = new DOMAudioChannel();
		effectsChannel.muted = !Settings.playSound;
		const musicChannel = new DOMAudioChannel();
		musicChannel.muted = !Settings.playMusic;
		engine.mixer = new Mixer(
			(id: number) => this.data.sounds[id].representation,
			musicChannel,
			effectsChannel
		);

		engine.renderer = new Renderer(this._sceneView.canvas);
		engine.sceneManager = this._sceneView.manager;
		engine.inputManager = new DesktopInputManager(this._sceneView);
		engine.metronome = new Metronome();
		engine.inventory = new Inventory();
		engine.scriptExecutor = new ScriptExecutor(engine, Instructions, Conditions);
		engine.hero = new Hero();
		engine.hero.addEventListener(Hero.Event.HealthChanged, () => {
			if (engine.hero.health > 0) {
				return;
			}

			this._engine.gameState = GameState.Lost;
			this._engine.sceneManager.pushScene(new LoseScene());
		});

		return engine;
	}

	private _determineRenderer(): typeof CanvasRenderer.Renderer {
		return CanvasRenderer.Renderer;
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
		const story = new Story(0xdead, Planet.ENDOR, WorldSize.Large);
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

		engine.palette = new PaletteAnimation(this.palette);

		const zoneScene = new ZoneScene();
		zoneScene.engine = engine;
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
		this._window.inventory.addEventListener(InventoryComponent.Events.ItemActivated, (e: CustomEvent) => {
			if (!(engine.sceneManager.currentScene instanceof ZoneScene)) {
				engine.sceneManager.popScene();
				return;
			}

			if (!e.detail.item) return;
			engine.metronome.stop();
		});

		this._window.inventory.addEventListener(InventoryComponent.Events.ItemPlaced, (e: CustomEvent) => {
			const location = e.detail.location as Point;
			const item = e.detail.item as Tile;

			const targetElement = document.elementFromPoint(location.x, location.y);
			const element =
				targetElement &&
				targetElement.closest(
					[
						AmmoComponet.tagName,
						WeaponComponent.tagName,
						HealthComponent.tagName,
						SceneView.tagName
					].join(",")
				);

			let used = false;
			if (element instanceof HealthComponent && item.isEdible) {
				console.log("consume");
				this.engine.consume(item);
				used = true;
			}

			if (item.isWeapon && (element instanceof AmmoComponet || element instanceof WeaponComponent)) {
				console.log("equip");
				this.engine.equip(item);
				used = true;
			}

			if (!used) {
				const { left, top } = this._sceneView.getBoundingClientRect();
				const pointInView = location
					.bySubtracting(left, top)
					.dividedBy(new Size(Tile.WIDTH, Tile.HEIGHT))
					.byFlooring();

				if (!new Rectangle(new Point(0, 0), new Size(9, 9)).contains(pointInView)) {
					engine.metronome.start();
					return;
				}

				const pointInZone = pointInView.bySubtracting(
					this.engine.camera.offset.x,
					this.engine.camera.offset.y
				);
				if (!new Rectangle(new Point(0, 0), this.engine.currentZone.size).contains(pointInZone)) {
					engine.metronome.start();
					return;
				}

				this.engine.inputManager.placedTile = item;
				this.engine.inputManager.placedTileLocation = pointInZone;
			}

			engine.metronome.start();
		});
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

				this._window.inventory.palette = details.palette;
				this._window.weapon.palette = details.palette;

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

	public jumpStartEngine(zone: Zone) {
		this._showSceneView(zone);
		this._window.inventory.palette = this.palette;
		this._window.engine = this.engine;
	}

	public get engine() {
		return this._engine;
	}
}

export default GameController;
