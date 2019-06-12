import { getFixtureContent } from "test/helpers";
import loadGameData from "test/helpers/game-data";
import { ComponentRegistry } from "src/ui";

import { ReplayingInputManager } from "src/debug/automation";
import { Yoda } from "src/engine/type";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/rendering";
import { SceneView } from "src/app/ui";
import { GameData, Engine, Story } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";
import { PaletteAnimation } from "src/engine/rendering";
import { Renderer as DummyRenderer } from "src/engine/dummy-interface";
import Settings from "src/settings";
import { dispatch } from "src/util";

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
		if (rawData) return;

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
			SceneManager: () => this.sceneView.manager
		});
		this.engine.data = new GameData(rawData);
		this.engine.palette = new PaletteAnimation(paletteData);
	}

	public async playNewStory(seed: number, planet: Planet, size: WorldSize, input: string[], debug = false) {
		const story = new Story(seed, planet, size);
		return await this.playStory(seed, story, input, debug);
	}

	public playStory(seed: number, story: Story, input: string[], debug = false): Promise<void> {
		return new Promise(async resolve => {
			const { sceneView, engine, inputManager } = this;

			Settings.debug = debug;
			Settings.skipDialogs = true;
			Settings.skipTransitions = true;
			Settings.pickupItemsAutomatically = true;

			try {
				document.body.appendChild(sceneView);

				story.generateWorld(engine.data);
				engine.story = story;

				engine.metronome.tickDuration = 1;
				engine.metronome.ontick = (delta: number) => engine.update(delta);
				engine.metronome.onrender = () => engine.render();

				sceneView.manager.engine = engine;
				const zone = engine.data.zones.find(z => z.isLoadingZone());
				const zoneScene = new ZoneScene(engine, zone);
				engine.currentZone = zone;
				engine.currentWorld = engine.world.locationOfZone(zone) ? engine.world : null;
				engine.hero.appearance = engine.data.characters.find(c => c.isHero());
				engine.sceneManager.pushScene(zoneScene);

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
		try {
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
			engine.data = null;
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
		} catch (e) {
			console.log("cleanup failed", e);
		}
	}
}
export default GameplayContext;
