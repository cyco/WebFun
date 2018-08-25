import { Window } from "src/ui/components";
import { Engine, EngineEvents } from "src/engine";
import { Controls } from "./components";
import {
	ConditionChecker,
	ConditionStore,
	InstructionExecutor,
	InstructionResult,
	InstructionStore,
	EvaluationMode
} from "src/engine/script";
import { Action, Instruction } from "src/engine/objects";
import Zone from "src/engine/objects/zone";
import Group from "src/ui/components/group";
import ActionComponent from "src/debug/components/action-component";
import "./script-debugger.scss";
import Settings from "src/settings";
import { WindowManager } from "src/ui";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Point } from "src/util";

class ScriptDebugger {
	private static _sharedDebugger: ScriptDebugger;
	private _window: Window;
	private _engine: Engine;
	private _isActive: boolean = false;
	private _actionList: Group;
	private _handlers = {
		zoneChange: () => this._rebuildActionList()
	};

	constructor() {
		this._window = <Window>document.createElement(Window.tagName);
		this._window.classList.add("script-debugger-window");
		this._window.title = "Script Debugger";
		this._window.origin = new Point(10, 10);
		this._window.autosaveName = "script-debugger";
		this._window.content.style.minWidth = "200px";

		this._setupDebuggerControls();
		this._setupActionList();
	}

	public static get sharedDebugger() {
		return (this._sharedDebugger = this._sharedDebugger || new ScriptDebugger());
	}

	get engine() {
		return this._engine;
	}

	set engine(e: Engine) {
		const isDebugging = this._isActive;

		if (this._engine) {
			this._teardownDebugger();
		}

		this._engine = e;

		if (this._engine && isDebugging) {
			this._setupDebugger();
		}
	}

	_setupDebuggerControls() {
		const controls = <Controls>document.createElement(Controls.tagName);
		controls.classList.add("script-debugger-window");
		controls.onstep = (): void => null;
		controls.ontogglepause = (): void => null;
		this._window.content.appendChild(controls);
	}

	_setupActionList() {
		const actionList = <Group>document.createElement(Group.tagName);
		actionList.classList.add("action-list");
		this._window.content.appendChild(actionList);
		this._actionList = actionList;
	}

	public show() {
		this._setupDebugger();
		this._window.onclose = () => this._teardownDebugger();
		WindowManager.defaultManager.showWindow(this._window);
	}

	private _setupDebugger() {
		if (this._isActive) return;
		if (!this._engine) return;

		const conditions = this._buildConditionStore(ConditionImplementations);
		this._engine.scriptExecutor.checker = new ConditionChecker(conditions, this._engine);
		const instructions = this._buildInstructionStore(InstructionImplementations);
		this._engine.scriptExecutor.executor = new InstructionExecutor(instructions, this._engine);

		this._engine.addEventListener(EngineEvents.CurrentZoneChange, this._handlers.zoneChange);

		this._isActive = true;
		Settings.debuggerActive = true;
	}

	private _teardownDebugger() {
		if (!this._isActive) return;
		Settings.debuggerActive = false;

		this._engine.removeEventListener(EngineEvents.CurrentZoneChange, this._handlers.zoneChange);
		this._engine.scriptExecutor.checker = new ConditionChecker(ConditionImplementations, this._engine);
		this._engine.scriptExecutor.executor = new InstructionExecutor(
			InstructionImplementations,
			this._engine
		);

		this._isActive = false;
	}

	private _buildConditionStore(originalStore: ConditionStore): ConditionStore {
		return originalStore.map((_, c) => (args: number[], zone: Zone, engine: Engine): Promise<boolean> =>
			this._handleConditionCall(c, args, zone, engine)
		);
	}

	private _handleConditionCall(
		opcode: number,
		args: number[],
		zone: Zone,
		engine: Engine
	): Promise<boolean> {
		return ConditionImplementations[opcode](args, zone, engine, EvaluationMode.Walk);
	}

	private _buildInstructionStore(originalStore: InstructionStore): InstructionStore {
		return originalStore.map(
			(_, i) => (
				instruction: Instruction,
				engine: Engine,
				action: Action
			): Promise<InstructionResult> => this._handleInstructionCall(i, instruction, engine, action)
		);
	}

	private _handleInstructionCall(
		opcode: number,
		instruction: Instruction,
		engine: Engine,
		action: Action
	): Promise<InstructionResult> {
		if (!opcode) return;
		return InstructionImplementations[opcode](instruction, engine, action);
	}

	private _rebuildActionList() {
		this._actionList.textContent = "";
		this._engine.currentZone.actions.forEach((action, idx) => {
			const component = <ActionComponent>document.createElement(ActionComponent.tagName);
			component.engine = this._engine;
			component.zone = this._engine.currentZone;
			component.index = idx;
			component.action = action;
			component.evaluateConditions();
			this._actionList.appendChild(component);
		});
	}

	private _updateEvaluation() {
		Array.from(this._actionList.querySelectorAll(ActionComponent.tagName)).forEach(
			(action: ActionComponent) => action.evaluateConditions()
		);
	}
}

export default ScriptDebugger;
