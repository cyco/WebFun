import "./test-creator-window.scss";

import { AbstractWindow, Button, IconButton } from "src/ui/components";
import { Point, DiscardingStorage, download } from "src/util";

import { GameController } from "src/app";
import { TestCase } from "src/debug/automation/test";
import { InputReplayer, InputRecorder } from "src/debug/components";
import ConfiguationBuilder from "./configuration-builder";
import SimulatedStory from "src/debug/simulated-story";
import adjacentZones from "./adjacent-zones";

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

	public constructor() {
		super();

		this.addTitlebarButton(
			<IconButton icon="download" title="Download test file" onclick={() => this.downloadTest()} />
		);

		this.content.style.width = "400px";
		this.content.style.height = "478px";

		this.content.appendChild(this._configBuilder);
		this.content.appendChild(
			<div className="button-container">
				<Button label="Cancel" onclick={() => this.close()} />
				<Button label="Start" onclick={() => this.start()} />
			</div>
		);
	}

	private start() {
		const story = this.buildStory();

		const controller = this.gameController;
		const engine = controller.engine;

		engine.hero.location = new Point(0, 0);
		engine.hero.visible = true;
		engine.currentWorld = story.world;
		engine.story = story;
		engine.data = controller.data;
		engine.inventory.removeAllItems();

		controller.jumpStartEngine(story.world.at(4, 5).zone);

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

	public buildStory() {
		const { data } = this._gameController;
		const t = (t: number) => (t > 0 ? data.tiles[t] : null);
		const z = (z: number) => (z > 0 ? data.zones[z] : null);
		const { zone, findItem, puzzleNPC, requiredItem1, requiredItem2 } = this._configBuilder.configuration;

		return new SimulatedStory(
			t(findItem),
			t(puzzleNPC),
			t(requiredItem1),
			t(requiredItem2),
			z(zone),
			adjacentZones(z(zone), this._gameController.data.zones),
			this._gameController.data.zones
		);
	}

	public downloadTest() {
		const { zone, findItem, puzzleNPC, requiredItem1, requiredItem2 } = this._configBuilder.configuration;

		const configuration = [];
		if (zone) configuration.push(`Zone: ${zone.toHex(3)}`);
		if (findItem) configuration.push(`Find: ${findItem.toHex(3)}`);
		if (puzzleNPC) configuration.push(`NPC: ${findItem.toHex(3)}`);
		if (requiredItem1) configuration.push(`Required: ${requiredItem1.toHex(3)}`);
		if (requiredItem2) configuration.push(`Required: ${requiredItem2.toHex(3)}`);

		download(
			[
				"-= WebFun Test =--",
				...configuration,
				"",
				"- Input -",
				this._recorder.dumpRecord(),
				"",
				"- Expect -",
				""
			].join("\n"),
			`zone-${zone.toHex(3)}.wftest`
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
	}

	public get testCase(): TestCase {
		return this._testCase;
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
