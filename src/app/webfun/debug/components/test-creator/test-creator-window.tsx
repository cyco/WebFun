import "./test-creator-window.scss";

import { AbstractWindow, Button, IconButton } from "src/ui/components";
import { Point, DiscardingStorage, download } from "src/util";

import { GameController } from "src/app/webfun/index";
import { TestCase, Configuration, Serializer } from "src/app/webfun/debug/automation/test";
import { ExpectationEditor } from "src/app/webfun/debug/components/index";
import ConfigurationBuilder from "./configuration-builder";
import SimulatedStory from "src/app/webfun/debug/simulated-story";
import adjacentZones from "./adjacent-zones";
import { Zone, Tile } from "src/engine/objects";
import { WorldSize } from "src/engine/generation";
import { Story, Engine, AssetManager } from "src/engine";
import Metronome, { MetronomeInternals } from "src/engine/metronome";
import { Yoda } from "src/variant";
import { RecordingInputManager, ReplayingInputManager } from "../../automation";
import { InputManager as AppInputManager } from "src/app/webfun/input";
import { assemble, parse } from "../../automation/input";
import { DefaultTickDuration } from "src/engine/metronome";

class TestCreatorWindow extends AbstractWindow implements EventListenerObject {
	public static readonly tagName = "wf-debug-test-creator-window";
	private _gameController: GameController;
	private _state: Storage = new DiscardingStorage();
	private _testCase: TestCase = null;
	private _configBuilder: ConfigurationBuilder = (<ConfigurationBuilder />) as ConfigurationBuilder;
	private _expectationEditor: ExpectationEditor = (<ExpectationEditor />) as ExpectationEditor;
	private _recorder: RecordingInputManager = null;
	private _input: string = ".";

	public constructor() {
		super();

		this.title = "Test Creator";
		this.autosaveName = "test-creator-window";
		this.addTitlebarButton(
			<IconButton icon="download" title="Download test file" onclick={() => this.downloadTest()} />
		);

		this.content.style.width = "400px";

		this.content.appendChild(this._configBuilder);
		this.content.appendChild(
			<div className="button-container">
				<Button label="Cancel" onclick={() => this.close()} />
				<Button label="Start" onclick={() => this.start()} />
			</div>
		);
	}

	private async start() {
		const controller = this.gameController;
		await controller.resetEngine();
		if (!controller.assets) await controller.loadGameData();
		const engine = controller.engine;
		const assets = controller.engine.assets;

		engine.settings.pickupItemsAutomatically = true;
		engine.settings.skipDialogs = true;
		engine.settings.skipTransitions = true;
		engine.settings.difficulty = this.testCase.configuration.difficulty;
		engine.settings.autostartEngine = false;

		const recorder = new RecordingInputManager(engine.inputManager as AppInputManager);
		recorder.records = parse(this.testCase.input);
		recorder.engine = engine;
		this._recorder = recorder;

		const replayer = new ReplayingInputManager();
		replayer.input = this.testCase.input;
		replayer.engine = engine;

		const handler = () => {
			engine.metronome.tickDuration = DefaultTickDuration;
			replayer.removeEventListener(ReplayingInputManager.Event.InputEnd, handler);

			replayer.removeListeners();
			engine.inputManager = recorder;
			recorder.addListeners();
			recorder.isRecording = true;
		};
		replayer.addEventListener(ReplayingInputManager.Event.InputEnd, handler);
		engine.inputManager = replayer;

		const story = this.buildStory(assets);
		story.generate(
			this.testCase.configuration.seed,
			Zone.Planet.fromNumber(this.testCase.configuration.planet ?? Zone.Planet.Endor.rawValue),
			WorldSize.fromNumber(this.testCase.configuration.size ?? WorldSize.Medium.rawValue)
		);
		engine.story = story;
		engine.currentWorld = story.world;
		engine.camera.update(Infinity);

		controller.jumpStartEngine(
			story instanceof SimulatedStory
				? story.world.at(4, 5).zone
				: assets.find(Zone, ({ type }) => type === Zone.Type.Load)
		);

		this.testCase.configuration.inventory.forEach(i =>
			engine.inventory.addItem(engine.assets.get(Tile, i))
		);
		if (!(story instanceof SimulatedStory)) {
			engine.currentWorld = story.dagobah;
			engine.totalPlayTime = 0;
			engine.currentPlayStart = new Date();
		}

		if (this.testCase.configuration.health) engine.hero.health = this.testCase.configuration.health;
		engine.hero.location = new Point(0, 0);
		engine.persistentState.gamesWon = this.testCase.configuration.gamesWon;

		engine.metronome.addEventListener(Metronome.Event.AfterTick, this);
		engine.metronome.addEventListener(Metronome.Event.BeforeTick, this);
		this._expectationEditor.engine = engine;

		this.content.textContent = "";
		this.content.appendChild(this._expectationEditor);

		engine.metronome.tickDuration = 1;
		(engine.metronome as any as MetronomeInternals)._tickCount[0] = 0;
		engine.metronome.start();
	}

	private buildStory(assets: AssetManager): SimulatedStory | Story {
		const config = this._configBuilder.configuration;
		if (config.zone >= 0) {
			return this._buildSimulatedStory(assets, config);
		}

		return this._buildStory(assets, config);
	}

	handleEvent(_: Event): void {
		this._expectationEditor.evaluateExpectations();
	}

	private _buildSimulatedStory(assets: AssetManager, config: Configuration) {
		const t = (t: number) => (t > 0 ? assets.get(Tile, t) : null);
		const z = (z: number) => (z > 0 ? assets.get(Zone, z) : null);

		const { zone, findItem, npc, requiredItem1, requiredItem2 } = config;

		return new SimulatedStory(
			t(findItem),
			t(npc),
			t(requiredItem1),
			t(requiredItem2),
			z(zone),
			adjacentZones(z(zone), assets.getAll(Zone)),
			assets
		);
	}

	private _buildStory(assets: AssetManager, config: Configuration) {
		const story = new Story(assets, Yoda);
		story.generate(
			config.seed,
			Zone.Planet.fromNumber(config.planet),
			WorldSize.fromNumber(config.size)
		);
		return story;
	}

	public downloadTest(): void {
		const serializer = new Serializer();
		const data = serializer.serialize(
			this._configBuilder.configuration,
			this._recorder ? assemble(this._recorder?.records).replace(/(\s\.)+$/gi, "") : this._input,
			this._expectationEditor.expectations
		);

		const { zone, size, planet, seed } = this._configBuilder.configuration;

		download(
			data,
			zone >= 0
				? `zone-${zone.toHex(3)}.wftest`
				: `world-${seed.toHex(3)}-${Zone.Planet.fromNumber(
						planet
				  ).name.toLowerCase()}-${WorldSize.fromNumber(size).name.toLowerCase()}.wftest`
		);
	}

	public close(): void {
		this.gameController.engine.metronome.removeEventListener(Metronome.Event.AfterTick, this);
		this.gameController.engine.metronome.removeEventListener(Metronome.Event.BeforeTick, this);
		this.gameController.engine.removeEventListener(Engine.Event.CurrentZoneChange, this);

		super.close();
	}

	public get gameController(): GameController {
		return this._gameController;
	}

	public set gameController(controller: GameController) {
		this._gameController = controller;
		this._configBuilder.palette = controller.palette;
		this._configBuilder.assets = controller.assets;
	}

	public set testCase(testCase: TestCase) {
		this._testCase = testCase;
		this._configBuilder.configuration = testCase.configuration;
		this._expectationEditor.expectations = testCase.expectations;
		this._input = testCase.input;
	}

	public get testCase(): TestCase {
		const testCase = Object.assign({}, this._testCase);

		testCase.expectations = this._expectationEditor.expectations;
		testCase.configuration = this._configBuilder.configuration;
		testCase.input = this._recorder ? assemble(this._recorder.records) : this._input;

		return testCase;
	}

	public set state(s: Storage) {
		this._state = s;
		this._configBuilder.state = s.prefixedWith(`config-builder`);
	}

	public get state(): Storage {
		return this._state;
	}
}

export default TestCreatorWindow;
