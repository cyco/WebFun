import "./test-creator-window.scss";

import { AbstractWindow, Button, IconButton } from "src/ui/components";
import { Point, DiscardingStorage, download, sleep } from "src/util";

import { GameController } from "src/app";
import { TestCase, Expectation, Configuration } from "src/debug/automation/test";
import { InputReplayer, InputRecorder } from "src/debug/components";
import ConfiguationBuilder from "./configuration-builder";
import SimulatedStory from "src/debug/simulated-story";
import adjacentZones from "./adjacent-zones";
import { Zone, Tile, Sound, Puzzle, Char } from "src/engine/objects";
import { Planet, WorldSize } from "src/engine/types";
import { Story, Engine, AssetManager, Hero } from "src/engine";
import Settings from "src/settings";

class TestCreatorWindow extends AbstractWindow {
	public static readonly tagName = "wf-debug-test-creator-window";
	title = "Test Creator";
	autosaveName = "test-creator-window";
	private _gameController: GameController;
	private _state: Storage = new DiscardingStorage();
	private _testCase: TestCase = null;
	private _configBuilder: ConfiguationBuilder = <ConfiguationBuilder /> as ConfiguationBuilder;
	private _replayer: InputReplayer = <InputReplayer /> as InputReplayer;
	private _recorder: InputRecorder = <InputRecorder /> as InputRecorder;
	private _expectations: Expectation[] = [];

	public constructor() {
		super();

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

		if (engine.metronome) {
			await engine.metronome.stop();
			(engine.metronome as any)._tickCount[0] = 0;
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

		engine.inventory.removeAllItems();
		this.testCase.configuration.inventory.forEach(i =>
			engine.inventory.addItem(engine.assets.get(Tile, i))
		);

		story.generateWorld(engine.assets, engine.persistentState.gamesWon);
		if (!(story instanceof SimulatedStory)) {
			engine.currentWorld = story.dagobah;
			engine.hero.visible = false;
			engine.temporaryState = {
				justEntered: true,
				enteredByPlane: true,
				bump: false
			};
		}

		controller.jumpStartEngine(
			story instanceof SimulatedStory
				? story.world.at(4, 5).zone
				: engine.assets.find(Zone, ({ type }) => type === Zone.Type.Load)
		);

		this.content.textContent = "";
		this.content.appendChild(this._replayer);
		this.content.appendChild(this._recorder);

		if (this.testCase) {
			this.setupInput(this.testCase.input);
		}
	}

	private setupInput(input: string): void {
		const replayer: InputReplayer = this._replayer;
		replayer.load(input.split(" "));
		replayer.start();
		replayer.fastForward();
	}

	public buildStory(engine: Engine) {
		const config = this._configBuilder.configuration;
		if (config.zone >= 0) {
			return this._buildSimulatedStory(engine, config);
		}

		return this._buildStory(config);
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
		return new Story(config.seed, Planet.fromNumber(config.planet), WorldSize.fromNumber(config.size));
	}

	public downloadTest() {
		const {
			size,
			seed,
			planet,
			zone,
			findItem,
			npc,
			requiredItem1,
			requiredItem2,
			gamesWon
		} = this._configBuilder.configuration;

		const configuration = [];
		if (seed >= 0) configuration.push(`Seed: ${seed.toHex(3)}`);
		if (planet > 0) configuration.push(`Planet: ${Planet.fromNumber(planet).name}`);
		if (size > 0) configuration.push(`Size: ${WorldSize.fromNumber(size).name}`);
		if (gamesWon > 0) configuration.push(`Games Won: ${gamesWon.toString(10)}`);
		if (zone >= 0) configuration.push(`Zone: ${zone.toHex(3)}`);
		if (findItem > 0) configuration.push(`Find: ${findItem.toHex(3)}`);
		if (npc > 0) configuration.push(`NPC: ${findItem.toHex(3)}`);
		if (requiredItem1 > 0) configuration.push(`Required: ${requiredItem1.toHex(3)}`);
		if (requiredItem2 > 0) configuration.push(`Required: ${requiredItem2.toHex(3)}`);

		download(
			[
				"-= WebFun Test =--",
				...configuration,
				"",
				"- Input -",
				this._recorder.input,
				"",
				"- Expect -",
				...this._expectations.map(e => e.format()),
				""
			].join("\n"),
			zone >= 0
				? `zone-${zone.toHex(3)}.wftest`
				: `world-${seed.toHex(3)}-${Planet.fromNumber(
						planet
				  ).name.toLowerCase()}-${WorldSize.fromNumber(size).name.toLowerCase()}.wftest`
		);
	}

	public get gameController() {
		return this._gameController;
	}

	public set gameController(controller) {
		this._gameController = controller;
		this._replayer.gameController = controller;
		this._recorder.gameController = controller;
		this._configBuilder.palette = controller.palette;
		this._configBuilder.gameData = controller.data;
	}

	public set testCase(testCase: TestCase) {
		this._testCase = testCase;
		this._configBuilder.configuration = testCase.configuration;
		this._expectations = testCase.expectations;
		this._recorder.input = testCase.input;
	}

	public get testCase(): TestCase {
		const testCase = Object.assign({}, this._testCase);

		testCase.expectations = this._expectations;
		testCase.configuration = this._configBuilder.configuration;
		testCase.input = this._recorder.input;

		return testCase;
	}

	public set state(s) {
		this._state = s;
		this._configBuilder.state = s.prefixedWith(`config-builder`);
	}

	public get state() {
		return this._state;
	}
}

export default TestCreatorWindow;
