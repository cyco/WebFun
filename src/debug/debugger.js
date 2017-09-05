import "./debugger.scss";
import { ComponentRegistry, Textbox } from "src/ui";
import { Window } from "src/ui/components";
import SteppingMetronome, { Status as MetronomeStatus } from "./stepping-metronome";
import BreakingExecutor, { Continuation as ContinuationMode } from "./breaking-executor";
import * as Components from "./components";

export default class {
	constructor(engine) {
		ComponentRegistry.sharedRegistry.registerComponents(Components);

		this._engine = engine;

		this._metronome = new SteppingMetronome(this._engine.metronome);
		this._executor = new BreakingExecutor(this._engine);
		this._executor.engine = engine;
		this._executor.onstop = (e) => this._executorStateChanged(e.detail);
		this._engine.metronome = this._metronome;
		this._engine.scriptExecutor = this._executor;

		this._window = document.createElement(Window.TagName);
		this._window.content.classList.add("debugger");
		this._window.content.style.flexDirection = "column";
		this._window.content.style.width = "200px";

		this._setupDebuggerControls();
		this._window.content.appendChild(document.createElement("hr"));
		this._setupPointerFields();
		this._window.content.appendChild(document.createElement("hr"));
		this._setupActionList();

		document.body.appendChild(this._window);
	}

	_executorStateChanged({action, zone, index, type}) {
		console.log("_executorStateChanged", action, zone, index, type);
		Array.from(this._actionList.querySelectorAll("[current]")).forEach(e => e.current = false);

		const actionNode = this._actionList.children[action];
		actionNode.expanded = true;

		if (type === "i") {
			const thingy = actionNode.querySelector(`wf-debug-instruction:nth-child(${index + 1})`);
			thingy.current = true;
			thingy.scrollIntoView();
		} else if (type === "c") {
			const thingy = actionNode.querySelector(`wf-debug-condition:nth-child(${index + 1})`);
			thingy.current = true;
			thingy.scrollIntoView();
		} else {
			actionNode.current = true;
			actionNode.scrollIntoView();
		}
	}

	_setupPointerFields() {
		const container = document.createElement("div");
		container.style.display = "flex";
		container.style.flexDirection = "row";

		const actionPointer = new Textbox();
		container.appendChild(actionPointer.element);
		this._actionPointerField = actionPointer;

		const instructionPointer = new Textbox();
		container.appendChild(instructionPointer.element);
		this._instructionPointerField = instructionPointer;

		this._window.content.appendChild(container);
	}

	_setupDebuggerControls() {
		const controls = new Components.Controls();
		controls.onstep = () => {
			this._executor.continue(ContinuationMode.Step);
		};
		controls.ontogglepause = () => {
			if (controls.running) this._metronome.stop();
			else this._executor.continue(ContinuationMode.Run);
		};
		controls.ondraw = () => {
			this._metronome.onrender();
		};
		this._metronome.onstatuschange = () => controls.running = this._metronome.status === MetronomeStatus.Running;
		this._window.content.appendChild(controls);
	}

	_setupActionList() {
		const actionList = document.createElement("div");
		actionList.classList.add("action-list");
		this._window.content.appendChild(actionList);
		this._actionList = actionList;
		this._engine.oncurrentzonechange = () => {
			console.log("Current Zone Changed");
			this.rebuildActionList();
		};
	}

	rebuildActionList() {
		this._actionList.clear();
		this._engine.currentZone.actions.forEach((action, idx) => {
			const component = new Components.Action();
			component.zone = this._engine.currentZone.id;
			component.index = idx;
			component.action = action;
			this._actionList.appendChild(component);
		});
	}
}
