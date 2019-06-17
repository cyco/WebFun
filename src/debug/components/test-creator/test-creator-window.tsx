import "./test-creator-window.scss";

import { AbstractWindow, Button } from "src/ui/components";
import { Point, DiscardingStorage } from "src/util";

import { GameController } from "src/app";
import { TestCase } from "src/debug/automation/test";
import { InputReplayer } from "src/debug/components";
import { WindowManager } from "src/ui";
import CaseBuilder from "./case-builder";

class TestCreatorWindow extends AbstractWindow {
	public static readonly tagName = "wf-debug-test-creator-window";
	title = "Test Creator";
	autosaveName = "test-creator-window";
	private _gameController: GameController;
	private _state: Storage = new DiscardingStorage();
	private _testCase: TestCase = null;
	private _caseBuilder: CaseBuilder = <CaseBuilder /> as CaseBuilder;

	public constructor() {
		super();

		this.content.style.width = "400px";
		this.content.style.height = "478px";

		this.content.appendChild(this._caseBuilder);
		this.content.appendChild(
			<div className="button-container">
				<Button label="Cancel" onclick={() => this.close()} />
				<Button label="Start" onclick={() => this.start()} />
			</div>
		);
	}

	private start() {
		const story = this._caseBuilder.buildStory();

		const controller = this.gameController;
		const engine = controller.engine;

		engine.hero.location = new Point(0, 0);
		engine.hero.visible = true;
		engine.currentWorld = story.world;
		engine.story = story;
		engine.data = controller.data;
		engine.inventory.removeAllItems();

		controller.jumpStartEngine(story.world.at(4, 5).zone);

		if (this.testCase) {
			this.setupInput(this.testCase.input);
		}

		this.close();
	}

	private setupInput(input: string): void {
		let replayer: InputReplayer = document.querySelector(InputReplayer.tagName);
		if (!replayer) {
			replayer = document.createElement(InputReplayer.tagName) as InputReplayer;
			replayer.gameController = this.gameController;
			WindowManager.defaultManager.showWindow(replayer);
		}

		replayer.load(input.split(" "));
		replayer.start();
		replayer.fastForward();
		WindowManager.defaultManager.focus(replayer);
	}

	public get gameController() {
		return this._gameController;
	}

	public set gameController(controller) {
		this._gameController = controller;
		this._caseBuilder.gameController = controller;
	}

	public set testCase(testCase: TestCase) {
		this._testCase = testCase;
		this._caseBuilder.testCaseConfiguration = testCase.configuration;
	}

	public get testCase(): TestCase {
		return this._testCase;
	}

	public set state(s) {
		this._state = s;
		this._caseBuilder.state = s.prefixedWith(`case-builder`);
	}

	public get state() {
		return this._state;
	}
}

export default TestCreatorWindow;
