import {
	Ammo as AmmoComponet,
	Health as HealthComponent,
	Inventory as InventoryComponent,
	LoadingView,
	SceneView,
	Weapon as WeaponComponent
} from "./ui";
import { Char, Tile, Zone, Sound, Puzzle } from "src/engine/objects";
import {
	ColorPalette,
	Engine,
	GameData,
	Hero,
	Story,
	AssetManager,
	GameType,
	Interface,
	PaletteAnimation
} from "src/engine";
import { ConfirmationResult, ModalConfirm } from "src/ux";
import { EventTarget, Point, Rectangle, Size, rand, srand } from "src/util";
import { FilePicker, WindowManager } from "src/ui";
import { LoseScene, ZoneScene, MapScene } from "src/engine/scenes";
import { MainMenu, MainWindow } from "./windows";
import { Planet, WorldSize } from "src/engine/types";
import GameState from "../engine/game-state";
import { Reader } from "src/engine/save-game";
import Settings from "src/settings";
import { CanvasRenderer } from "./rendering";
import { DesktopInputManager, TouchInputManager } from "./input";
import Loader from "./loader";
import ResourceManager from "./resource-manager";
import CursorManager from "./input/cursor-manager";
import { Channel } from "src/engine/audio";
import { Mixer } from "./audio";
import { Yoda } from "src/engine/type";
import DebugInfoScene from "src/debug/debug-info-scene";
import { OnscreenPad, OnscreenButton } from "./ui";
import { round, random, floor } from "src/std/math";

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
	private _window: MainWindow = (<MainWindow menu={new MainMenu(this)} />) as MainWindow;
	private _sceneView: SceneView = (<SceneView />) as SceneView;
	private _engine: Engine;

	constructor(type: GameType, paths: PathConfiguration) {
		super();

		this._engine = this._buildEngine(type, paths);
		this._sceneView.manager.engine = this._engine;
		if (this.settings.debug) (window as any).engine = this._engine;
		if (this.settings.mobile) this._window.classList.add("mobile");
	}

	private _buildEngine(type: GameType, paths: PathConfiguration) {
		const engine: Engine = new Engine(type, this._buildInterface(paths));
		engine.hero.addEventListener(Hero.Event.HealthChanged, this);

		if (this.settings.drawDebugStats) {
			engine.sceneManager.addOverlay(new DebugInfoScene());
		}

		return engine;
	}

	handleEvent(evt: CustomEvent): void {
		const engine = this.engine;
		switch (evt.type) {
			case Hero.Event.HealthChanged: {
				if (engine.hero.health > 0) {
					return;
				}

				if (engine.inventory.contains(Yoda.tileIDs.SpiritHeart)) {
					engine.hero.health = Hero.MaxHealth;
					engine.inventory.removeItem(Yoda.tileIDs.SpiritHeart);
					const flourish = engine.assets.get(Sound, Yoda.sounds.Flourish);
					engine.mixer.play(flourish, Channel.Effect);
					return;
				}

				this._engine.gameState = GameState.Lost;
				this._engine.sceneManager.pushScene(new LoseScene());
				return;
			}
			case InventoryComponent.Events.ItemActivated: {
				if (engine.gameState !== GameState.Running) {
					evt.preventDefault();
					return;
				}

				if (!(engine.sceneManager.currentScene instanceof ZoneScene)) {
					engine.sceneManager.popScene();
					return;
				}

				const item = evt.detail.item;
				if (!item) return;

				if (item.id === Yoda.tileIDs.Locator) {
					this.engine.sceneManager.pushScene(new MapScene());
					return;
				}

				engine.metronome.stop();
				return;
			}

			case InventoryComponent.Events.ItemPlaced: {
				if (engine.gameState !== GameState.Running) {
					evt.preventDefault();
					return;
				}

				const location = evt.detail.location as Point;
				const item = evt.detail.item as Tile;

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

				if (
					item.isWeapon &&
					(element instanceof AmmoComponet || element instanceof WeaponComponent)
				) {
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
					pointInZone.z = null;
					if (!new Rectangle(new Point(0, 0), this.engine.currentZone.size).contains(pointInZone)) {
						engine.metronome.start();
						return;
					}

					this.engine.inputManager.placedTile = item;
					this.engine.inputManager.placedTileLocation = pointInZone;
				}

				engine.metronome.start();
			}
		}
	}

	private _buildInterface(paths: any): Partial<Interface> {
		const mixer = new Mixer(this.settings);
		const renderer = new CanvasRenderer.Renderer(this._sceneView.canvas);
		const inputManager = !this.settings.mobile
			? new DesktopInputManager(this._sceneView, new CursorManager(this._sceneView))
			: new TouchInputManager(
					this._sceneView,
					this._window.content.querySelector(OnscreenPad.tagName),
					this._window.content.querySelector(`${OnscreenButton.tagName}.shoot`),
					this._window.content.querySelector(`${OnscreenButton.tagName}.drag`)
			  );
		const resources = new ResourceManager(paths.palette, paths.data, paths.sfx);
		const loader = new Loader(resources, mixer);

		return {
			Renderer: () => renderer,
			InputManager: () => inputManager,
			Loader: () => loader,
			SceneManager: () => this._sceneView.manager,
			ResourceManager: () => resources,
			Mixer: () => mixer
		};
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
		engine.currentWorld = engine.world.findLocationOfZone(zone) ? engine.world : null;
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

			const loader = this.engine.loader;
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
