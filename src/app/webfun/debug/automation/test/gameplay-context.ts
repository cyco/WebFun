import { ComponentRegistry } from "src/ui";

import { ReplayingInputManager } from "src/app/webfun/debug/automation/index";
import { Yoda } from "src/variant";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/webfun/rendering";
import { SceneView } from "src/app/webfun/ui";
import { Engine, Story, AssetManager, Variant, GameState } from "src/engine";
import { WorldSize } from "src/engine/generation";
import { Tile, Zone, Puzzle, Sound, Character, Action } from "src/engine/objects";
import { PaletteAnimation, ColorPalette } from "src/engine/rendering";
import { Renderer as DummyRenderer } from "src/engine/dummy-interface";
import Settings, { defaultSettings } from "src/settings";
import { Point } from "src/util";
import { SimulatedStory } from "src/app/webfun/debug/index";
import DebuggingScriptProcessingUnit from "src/app/webfun/debug/debugging-script-processing-unit";
import { EvaluationMode, ScriptProcessingUnit } from "src/engine/script";
import { Data } from "src/engine/file-format";

let rawData: Data, paletteData: any;

class GameplayContext {
	public engine: Engine;
	public settings: Settings;
	private debug: boolean;
	private inputManager: ReplayingInputManager;
	public sceneView: SceneView;
	public onInputEnd: (_: Event) => void;

	constructor(debug = false) {
		this.debug = debug;
		this.settings = Object.assign({}, defaultSettings);
	}

	public async prepare(loadGameData: (_: Variant) => Promise<Data>): Promise<void> {
		if (rawData) {
			return;
		}

		const registry = ComponentRegistry.sharedRegistry;
		if (!registry.contains(SceneView)) registry.registerComponent(SceneView);

		rawData = await loadGameData(Yoda);
		paletteData = ColorPalette.FromBGR8Buffer(await getFixtureData("yoda.pal"));
	}

	public buildEngine(): void {
		this.sceneView = document.createElement(SceneView.tagName);
		this.inputManager = new ReplayingInputManager();
		this.engine = new Engine(Yoda, {
			InputManager: () => this.inputManager,
			Renderer: () =>
				this.debug ? new CanvasRenderer.Renderer(this.sceneView.canvas) : new DummyRenderer(),
			SceneManager: () => this.sceneView.manager,
			AssetManager: () => this.buildAssetManagerFromGameData(rawData),
			ScriptProcessingUnit: (engine, conditions, instructions) => {
				if (typeof window.__webfun_coverage__ === "undefined") {
					return new ScriptProcessingUnit(engine, conditions, instructions);
				}

				const spu = new DebuggingScriptProcessingUnit(engine, conditions, instructions);
				let currentZone: Zone;
				let currentAction: Action;
				let coverageAction: any = null;
				spu.delegate = {
					executorWillExecute(_, thing) {
						if (thing instanceof Zone) {
							currentZone = thing;
							window.__webfun_coverage__.zones[currentZone.id] =
								window.__webfun_coverage__.zones[currentZone.id] || {};
							window.__webfun_coverage__.zones[currentZone.id].visited = true;
						}

						if (thing instanceof Action) {
							currentAction = thing;
							const id = `${currentZone.id.toString()}_${currentAction.id.toString()}`;
							window.__webfun_coverage__.actions[id] = window.__webfun_coverage__.actions[id] || {};
							coverageAction = window.__webfun_coverage__.actions[id];
						}

						if ("isCondition" in thing) {
							const id = currentAction.conditions.indexOf(thing);
							coverageAction.conditions = coverageAction.conditions || [];
							coverageAction.conditions[id] = coverageAction.conditions[id] || 0;
							coverageAction.conditions[id]++;

							window.__webfun_coverage__.conditions[thing.opcode] =
								window.__webfun_coverage__.conditions[thing.opcode] || 0;
							window.__webfun_coverage__.conditions[thing.opcode]++;
						}

						if ("isInstruction" in thing) {
							const id = currentAction.instructions.indexOf(thing);
							coverageAction.instructions = coverageAction.instructions || [];
							coverageAction.instructions[id] = coverageAction.instructions[id] || 0;
							coverageAction.instructions[id]++;

							window.__webfun_coverage__.instructions[thing.opcode] =
								window.__webfun_coverage__.instructions[thing.opcode] || 0;
							window.__webfun_coverage__.instructions[thing.opcode]++;
						}
					},

					executorDidExecute(_, thing) {
						if (thing instanceof Zone) {
							currentZone = null;
						}
						if (thing instanceof Action) {
							currentAction = null;
						}
					},
					executorDidDrain(_: DebuggingScriptProcessingUnit): void {
						currentZone = null;
						currentAction = null;
					}
				};

				return spu;
			}
		});

		const variant = this.engine.variant;
		this.engine.palette = new PaletteAnimation(
			paletteData,
			variant.fastColorCycles,
			variant.slowColorCycles
		);
		this.engine.settings = this.settings;
	}

	private buildAssetManagerFromGameData(rawData: Data) {
		const data = rawData;
		const assets = new AssetManager();

		assets.populate(Uint8Array, [data.startup]);
		assets.populate(
			Sound,
			data.sounds.map((s, idx) => new Sound(idx, s))
		);
		assets.populate(
			Tile,
			data.tiles.map((t, idx) => new Tile(idx, t))
		);
		assets.populate(
			Puzzle,
			data.puzzles.map((p, idx) => new Puzzle(idx, p, assets))
		);
		assets.populate(
			Character,
			data.characters.map((c, idx) => new Character(idx, c, assets))
		);
		assets.populate(
			Zone,
			data.zones.map((z, idx) => new Zone(idx, z, assets))
		);

		return assets;
	}

	public async playNewStory(
		seed: number,
		planet: Zone.Planet,
		size: WorldSize,
		input: string,
		debug = false
	): Promise<void> {
		const story = new Story(this.engine.assets, this.engine.variant);
		story.generate(seed, planet, size);
		return await this.playStory(story, input, debug);
	}

	public setupEngine(story: Story, input: string, debug = false): void {
		const { sceneView, engine, inputManager } = this;
		this.settings.debug = debug;
		this.settings.skipDialogs = true;
		this.settings.skipTransitions = true;
		this.settings.pickupItemsAutomatically = true;
		this.settings.skipWinScene = true;

		document.body.appendChild(sceneView);

		story.generate(story.seed, story.planet, story.size);
		engine.story = story;

		engine.metronome.tickDuration = debug ? 50 : 1;
		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		sceneView.manager.engine = engine;

		const zone =
			story instanceof SimulatedStory
				? engine.world.at(4, 5).zone
				: engine.assets.find(Zone, z => z.isLoadingZone());
		const zoneScene = new ZoneScene(engine, zone);
		engine.currentZone = zone;
		engine.currentWorld = engine.world.findLocationOfZone(zone) ? story.world : story.dagobah;
		engine.hero.appearance = engine.assets.find(Character, c => c.isHero());
		engine.spu.prepareExecution(EvaluationMode.JustEntered, zone);
		engine.sceneManager.pushScene(zoneScene);
		if (story instanceof SimulatedStory) {
			engine.hero.visible = true;
			engine.hero.location = new Point(0, 0);
		}

		inputManager.engine = engine;
		inputManager.input = input;
	}

	public async playStory(story: Story, input: string, debug = false): Promise<void> {
		return new Promise(async resolve => {
			this.setupEngine(story, input, debug);
			this.onInputEnd = () => resolve();
			const inputManager = this.engine.inputManager as ReplayingInputManager;
			inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, this.onInputEnd);
			inputManager.addListeners();
			this.engine.metronome.start();
			this.engine.gameState = GameState.Running;
		});
	}

	public async cleanup(): Promise<void> {
		const { sceneView, engine } = this;

		if (!engine) {
			return;
		}

		await engine.metronome.stop();

		engine.inputManager.engine = engine;
		engine.inputManager.removeListeners();
		(engine.inputManager as ReplayingInputManager).removeEventListener(
			ReplayingInputManager.Event.InputEnd,
			this.onInputEnd
		);
		(engine.inputManager as ReplayingInputManager).input = "";
		engine.sceneManager.clear();

		engine.currentWorld = null;
		engine.currentZone = null;

		engine.assets.populate(Zone, []);
		engine.assets.populate(Tile, []);
		engine.assets.populate(Puzzle, []);
		engine.assets.populate(Character, []);
		engine.assets.populate(Sound, []);
		engine.assets = null;
		engine.hero.appearance = null;
		engine.hero = null;
		engine.inputManager.engine = null;
		engine.inputManager = null;
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
