import "./test-creator-window.scss";

import { AbstractWindow, Button, IconButton } from "src/ui/components";
import { Point, DiscardingStorage, download } from "src/util";

import { GameController } from "src/app/webfun/index";
import { TestCase, Configuration, Serializer } from "src/app/webfun/debug/automation/test";
import {
	InputReplayer,
	InputRecorder,
	ExpectationEditor
} from "src/app/webfun/debug/components/index";
import ConfigurationBuilder from "./configuration-builder";
import SimulatedStory from "src/app/webfun/debug/simulated-story";
import adjacentZones from "./adjacent-zones";
import { Zone, Tile, Sound, Puzzle, Char } from "src/engine/objects";
import { WorldSize } from "src/engine/generation";
import { Story, Engine, AssetManager, Hero } from "src/engine";
import Settings from "src/settings";
import Metronome, { MetronomeInternals } from "src/engine/metronome";

class TestCreatorWindow extends AbstractWindow implements EventListenerObject {
	public static readonly tagName = "wf-debug-test-creator-window";
	private _gameController: GameController;
	private _state: Storage = new DiscardingStorage();
	private _testCase: TestCase = null;
	private _configBuilder: ConfigurationBuilder = (<ConfigurationBuilder />) as ConfigurationBuilder;
	private _replayer: InputReplayer = (<InputReplayer />) as InputReplayer;
	private _recorder: InputRecorder = (<InputRecorder />) as InputRecorder;
	private _expectationEditor: ExpectationEditor = (<ExpectationEditor />) as ExpectationEditor;

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
		const engine = controller.engine;

		Settings.pickupItemsAutomatically = true;
		Settings.skipDialogs = true;
		Settings.skipTransitions = true;
		Settings.difficulty = this.testCase.configuration.difficulty;

		if (engine.metronome) {
			await engine.metronome.stop();
			((engine.metronome as any) as MetronomeInternals)._tickCount[0] = 0;
		}

		const data = (controller.data = controller.data.copy());
		engine.assets = new AssetManager();
		engine.assets.populate(Zone, data.zones);
		engine.assets.populate(Tile, data.tiles);
		engine.assets.populate(Puzzle, data.puzzles);
		engine.assets.populate(Char, data.characters);
		engine.assets.populate(Sound, data.sounds);

		const story = this.buildStory(engine);
		engine.hero.location = new Point(0, 0);
		engine.hero.visible = true;
		engine.hero.health = Hero.MaxHealth;
		engine.story = story;
		engine.currentWorld = story.world;
		engine.camera.update(0);
		engine.persistentState.gamesWon = this.testCase.configuration.gamesWon;
		engine.metronome.addEventListener(Metronome.Event.AfterTick, this);
		engine.metronome.addEventListener(Metronome.Event.BeforeTick, this);

		engine.inventory.removeAllItems();
		this.testCase.configuration.inventory.forEach(i =>
			engine.inventory.addItem(engine.assets.get(Tile, i))
		);

		if (this.testCase.configuration.health) engine.hero.health = this.testCase.configuration.health;

		story.generateWorld(engine.assets, engine.persistentState.gamesWon);
		if (!(story instanceof SimulatedStory)) {
			engine.currentWorld = story.dagobah;
			engine.hero.visible = false;
			engine.temporaryState = {
				justEntered: true,
				enteredByPlane: true,
				bump: false,
				totalPlayTime: 0,
				currentPlayStart: new Date()
			};
		}

		controller.jumpStartEngine(
			story instanceof SimulatedStory
				? story.world.at(4, 5).zone
				: engine.assets.find(Zone, ({ type }) => type === Zone.Type.Load)
		);

		this._expectationEditor.engine = engine;

		this.content.textContent = "";
		this.content.appendChild(this._replayer);
		this.content.appendChild(this._recorder);
		this.content.appendChild(this._expectationEditor);

		if (this.testCase) {
			this.setupInput(this.testCase.input);
		}
	}

	private setupInput(input: string): void {
		const replayer: InputReplayer = this._replayer;
		replayer.load(input);
		replayer.start();
		replayer.fastForward();
	}

	public buildStory(engine: Engine): SimulatedStory | Story {
		const config = this._configBuilder.configuration;
		if (config.zone >= 0) {
			return this._buildSimulatedStory(engine, config);
		}

		engine.removeEventListener(Engine.Event.CurrentZoneChange, this);
		engine.addEventListener(Engine.Event.CurrentZoneChange, this);
		return this._buildStory(config);
	}

	handleEvent(evt: Event): void {
		if (
			evt.type === Engine.Event.CurrentZoneChange &&
			!this._replayer.isInstalled() &&
			Settings.autosaveTestOnZoneChange
		) {
			this.downloadTest();
		}

		this._expectationEditor.evaluateExpectations();
	}

	private _buildSimulatedStory(engine: Engine, config: Configuration) {
		const assets = engine.assets;
		const t = (t: number) => (t > 0 ? assets.get(Tile, t) : null);
		const z = (z: number) => (z > 0 ? assets.get(Zone, z) : null);

		const { zone, findItem, npc, requiredItem1, requiredItem2 } = config;

		return new SimulatedStory(
			t(findItem),
			t(npc),
			t(requiredItem1),
			t(requiredItem2),
			z(zone),
			adjacentZones(z(zone), this._gameController.data.zones),
			assets
		);
	}

	private _buildStory(config: Configuration) {
		return new Story(
			config.seed,
			Zone.Planet.fromNumber(config.planet),
			WorldSize.fromNumber(config.size)
		);
	}

	public downloadTest(): void {
		const serializer = new Serializer();
		const data = serializer.serialize(
			this._configBuilder.configuration,
			this._recorder.input.replace(/(\s\.)+$/gi, ""),
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
		this._replayer.gameController = controller;
		this._recorder.gameController = controller;
		this._configBuilder.palette = controller.palette;
		this._configBuilder.gameData = controller.data;
	}

	public set testCase(testCase: TestCase) {
		this._testCase = testCase;
		this._configBuilder.configuration = testCase.configuration;
		this._expectationEditor.expectations = testCase.expectations;
		this._recorder.input = testCase.input;
	}

	public get testCase(): TestCase {
		const testCase = Object.assign({}, this._testCase);

		testCase.expectations = this._expectationEditor.expectations;
		testCase.configuration = this._configBuilder.configuration;
		testCase.input = this._recorder.input;

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
