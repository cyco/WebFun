import loadGameData from "test/helpers/game-data";
import { ComponentRegistry } from "src/ui";

import { ReplayingInputManager } from "src/debug/automation";
import { Yoda } from "src/engine/type";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/rendering";
import { SceneView } from "src/app/ui";
import { GameData, Engine, Story, AssetManager } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";
import { Tile, Zone, Puzzle, Sound, Char } from "src/engine/objects";
import { PaletteAnimation } from "src/engine/rendering";
import { Renderer as DummyRenderer } from "src/engine/dummy-interface";
import Settings from "src/settings";
import { dispatch, Point } from "src/util";
import { SimulatedStory } from "src/debug";

let rawData: any, paletteData: any;

class GameplayContext {
	public engine: Engine;
	private debug: boolean;
	private inputManager: ReplayingInputManager;
	private sceneView: SceneView;
	private onInputEnd: (_: Event) => void;

	constructor(debug = false) {
		this.debug = debug;
	}

	public async prepare() {
		if (rawData) {
			return;
		}

		const registry = ComponentRegistry.sharedRegistry;
		if (!registry.contains(SceneView)) registry.registerComponent(SceneView);

		rawData = await loadGameData(Yoda);
		paletteData = Uint32Array.paletteFromArrayBuffer(await getFixtureData("yoda.pal"));
	}

	public buildEngine() {
		this.sceneView = document.createElement(SceneView.tagName);
		this.inputManager = new ReplayingInputManager();
		this.engine = new Engine(Yoda, {
			InputManager: () => this.inputManager,
			Renderer: () =>
				this.debug ? new CanvasRenderer.Renderer(this.sceneView.canvas) : new DummyRenderer(),
			Loader: () => null,
			SceneManager: () => this.sceneView.manager,
			AssetManager: () => this.buildAssetManagerFromGameData(rawData)
		});

		this.engine.palette = new PaletteAnimation(paletteData);
	}

	private buildAssetManagerFromGameData(rawData: any) {
		const data = new GameData(rawData);
		const assetManager = new AssetManager();

		assetManager.populate(Zone, data.zones);
		assetManager.populate(Tile, data.tiles);
		assetManager.populate(Puzzle, data.puzzles);
		assetManager.populate(Char, data.characters);
		assetManager.populate(Sound, data.sounds);

		return assetManager;
	}

	public async playNewStory(seed: number, planet: Planet, size: WorldSize, input: string[], debug = false) {
		const story = new Story(seed, planet, size);
		return await this.playStory(story, input, debug);
	}

	public playStory(story: Story, input: string[], debug = false): Promise<void> {
		return new Promise(async resolve => {
			const { sceneView, engine, inputManager } = this;

			Settings.debug = debug;
			Settings.skipDialogs = true;
			Settings.skipTransitions = true;
			Settings.pickupItemsAutomatically = true;

			try {
				document.body.appendChild(sceneView);

				story.generateWorld(engine.assetManager);
				engine.story = story;

				engine.metronome.tickDuration = 1;
				engine.metronome.ontick = (delta: number) => engine.update(delta);
				engine.metronome.onrender = () => engine.render();

				sceneView.manager.engine = engine;

				const zone =
					story instanceof SimulatedStory
						? engine.world.at(4, 5).zone
						: engine.assetManager.find(Zone, z => z.isLoadingZone());
				const zoneScene = new ZoneScene(engine, zone);
				engine.currentZone = zone;
				engine.currentWorld = engine.world.locationOfZone(zone) ? engine.world : null;
				engine.hero.appearance = engine.assetManager.find(Char, c => c.isHero());
				engine.sceneManager.pushScene(zoneScene);
				if (story instanceof SimulatedStory) {
					engine.hero.visible = true;
					engine.hero.location = new Point(0, 0);
				}

				inputManager.engine = engine;
				inputManager.input = input;
				this.onInputEnd = () => resolve();
				inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, this.onInputEnd);
				engine.inputManager.addListeners();
				engine.metronome.start();
			} catch (e) {
				console.log("error", e);
				resolve();
			}
		});
	}

	public async cleanup() {
		const { sceneView, engine } = this;

		if (!engine) {
			return;
		}

		engine.metronome.stop();
		await dispatch(() => void 0, 5);

		engine.inputManager.engine = engine;
		engine.inputManager.removeListeners();
		(engine.inputManager as ReplayingInputManager).removeEventListener(
			ReplayingInputManager.Event.InputEnd,
			this.onInputEnd
		);
		(engine.inputManager as ReplayingInputManager).input = [];
		engine.sceneManager.clear();

		engine.currentWorld = null;
		engine.currentZone = null;

		engine.assetManager.populate(Zone, []);
		engine.assetManager.populate(Tile, []);
		engine.assetManager.populate(Puzzle, []);
		engine.assetManager.populate(Char, []);
		engine.assetManager.populate(Sound, []);
		engine.assetManager = null;
		engine.hero.appearance = null;
		engine.hero = null;
		engine.inputManager.engine = null;
		engine.inputManager = null;
		engine.loader = null;
		engine.metronome.onrender = (): void => void 0;
		engine.metronome.ontick = (): void => void 0;
		engine.metronome = null;
		engine.palette = null;
		engine.renderer = null;
		engine.sceneManager.engine = null;
		engine.sceneManager = null;
		engine.story = null;
		sceneView.remove();

		this.engine = null;
		this.inputManager = null;
		this.onInputEnd = null;
		this.sceneView = null;
	}
}
export default GameplayContext;
