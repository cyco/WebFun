import { ComponentRegistry } from "src/ui";

import { ReplayingInputManager } from "src/debug/automation";
import { GameType, Yoda } from "src/engine/type";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/rendering";
import { SceneView } from "src/app/ui";
import { GameData, Engine, Story, AssetManager } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";
import { Tile, Zone, Puzzle, Sound, Char, Action } from "src/engine/objects";
import { PaletteAnimation, ColorPalette } from "src/engine/rendering";
import { Renderer as DummyRenderer } from "src/engine/dummy-interface";
import Settings from "src/settings";
import { dispatch, Point } from "src/util";
import { SimulatedStory } from "src/debug";
import DebuggingScriptProcessingUnit from "src/debug/debugging-script-processing-unit";
import { ScriptProcessingUnit } from "src/engine/script";

let rawData: any, paletteData: any;

class GameplayContext {
	public engine: Engine;
	private debug: boolean;
	private inputManager: ReplayingInputManager;
	public sceneView: SceneView;
	public onInputEnd: (_: Event) => void;

	constructor(debug = false) {
		this.debug = debug;
	}

	public async prepare(loadGameData: (_: GameType) => Promise<any>): Promise<void> {
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
							window.__webfun_coverage__.actions[id] =
								window.__webfun_coverage__.actions[id] || {};
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
					}
				};

				return spu;
			}
		});

		this.engine.palette = new PaletteAnimation(paletteData);
	}

	private buildAssetManagerFromGameData(rawData: any) {
		const data = new GameData(rawData);
		const assets = new AssetManager();

		assets.populate(Zone, data.zones);
		assets.populate(Tile, data.tiles);
		assets.populate(Puzzle, data.puzzles);
		assets.populate(Char, data.characters);
		assets.populate(Sound, data.sounds);

		return assets;
	}

	public async playNewStory(
		seed: number,
		planet: Planet,
		size: WorldSize,
		input: string[],
		debug = false
	): Promise<void> {
		const story = new Story(seed, planet, size);
		return await this.playStory(story, input, debug);
	}

	public setupEngine(story: Story, input: string[], debug = false): void {
		const { sceneView, engine, inputManager } = this;

		Settings.debug = debug;
		Settings.skipDialogs = true;
		Settings.skipTransitions = true;
		Settings.pickupItemsAutomatically = true;
		Settings.skipWinScene = true;

		document.body.appendChild(sceneView);

		engine.story = story;
		story.generateWorld(engine.assets, engine.persistentState.gamesWon);

		engine.metronome.tickDuration = 1;
		engine.metronome.ontick = (delta: number) => engine.update(delta);
		engine.metronome.onrender = () => engine.render();

		sceneView.manager.engine = engine;

		const zone =
			story instanceof SimulatedStory
				? engine.world.at(4, 5).zone
				: engine.assets.find(Zone, z => z.isLoadingZone());
		const zoneScene = new ZoneScene(engine, zone);
		engine.currentZone = zone;
		engine.currentWorld = engine.world.findLocationOfZone(zone) ? engine.world : null;
		engine.hero.appearance = engine.assets.find(Char, c => c.isHero());
		engine.sceneManager.pushScene(zoneScene);
		if (story instanceof SimulatedStory) {
			engine.hero.visible = true;
			engine.hero.location = new Point(0, 0);
		} else {
			engine.currentWorld = story.dagobah;
		}

		inputManager.engine = engine;
		inputManager.input = input;
	}

	public async playStory(story: Story, input: string[], debug = false): Promise<void> {
		return new Promise(async resolve => {
			this.setupEngine(story, input, debug);
			this.onInputEnd = () => resolve();
			const inputManager = this.engine.inputManager as ReplayingInputManager;
			inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, this.onInputEnd);
			inputManager.addListeners();
			this.engine.metronome.start();
		});
	}

	public async cleanup(): Promise<void> {
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

		engine.assets.populate(Zone, []);
		engine.assets.populate(Tile, []);
		engine.assets.populate(Puzzle, []);
		engine.assets.populate(Char, []);
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
