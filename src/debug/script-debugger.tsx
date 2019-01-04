import { Window } from "src/ui/components";
import { Engine, EngineEvents } from "src/engine";
import Controls from "./components/controls";
import Group from "src/ui/components/group";
import ActionComponent from "src/debug/components/action-component";
import Settings from "src/settings";
import { WindowManager } from "src/ui";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Point } from "src/util";
import DebuggingScriptExecutor, { DebuggingScriptExecutorDelegate } from "./debugging-script-executor";
import AlternateScriptExecutor from "src/engine/script/alternate-script-executor";
import "./script-debugger.scss";
import { Zone, Action, Condition, Instruction } from "src/engine/objects";
import { ScriptResult, Result } from "src/engine/script";
import BreakpointStore from "./breakpoint-store";
import { LocationBreakpoint } from "./breakpoint";

class ScriptDebugger implements DebuggingScriptExecutorDelegate {
	private static _sharedDebugger: ScriptDebugger;
	private _window: Window;
	private _engine: Engine;
	private _isActive: boolean = false;
	private _actionList: Group;
	private _handlers = {
		zoneChange: () => this._rebuildActionList()
	};
	private _breakAfter: boolean;

	private _currentZone: Zone = null;
	private _currentAction: Action = null;
	private _breakpointStore: BreakpointStore = BreakpointStore.sharedStore;

	constructor() {
		this._breakpointStore.backend = localStorage.prefixedWith("debug");

		this._window = (
			<Window
				className="script-debugger-window"
				title="Script Debugger"
				origin={new Point(10, 10)}
				autosaveName="script-debugger"
			/>
		) as Window;
		this._window.content.style.minWidth = "200px";
		this._window.content.appendChild(
			<Controls onstep={(): void => this.stepOnce()} ontogglepause={(): void => this.togglePause()} />
		);
		console.log((this._window.content.lastElementChild as any).constructor.name);
		console.log((this._window.content.lastElementChild as any).onstep);
		this._actionList = <Group className="action-list" /> as Group;
		this._window.content.appendChild(this._actionList);
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

	public show() {
		this._setupDebugger();
		this._window.onclose = () => this._teardownDebugger();
		WindowManager.defaultManager.showWindow(this._window);
	}

	private _setupDebugger() {
		if (this._isActive) return;
		if (!this._engine) return;

		this._engine.alternateScriptExecutor = new DebuggingScriptExecutor(
			this._engine,
			InstructionImplementations,
			ConditionImplementations,
			this
		);
		this._engine.addEventListener(EngineEvents.CurrentZoneChange, this._handlers.zoneChange);

		this._isActive = true;
		Settings.debuggerActive = true;
	}

	private _teardownDebugger() {
		if (!this._isActive) return;
		Settings.debuggerActive = false;

		this._engine.removeEventListener(EngineEvents.CurrentZoneChange, this._handlers.zoneChange);
		this._engine.alternateScriptExecutor = new AlternateScriptExecutor(
			this._engine,
			InstructionImplementations,
			ConditionImplementations
		);
		this._isActive = false;
	}

	private _rebuildActionList() {
		this._actionList.textContent = "";
		this._engine.currentZone.actions.forEach((action, idx) => {
			const component = (
				<ActionComponent
					engine={this._engine}
					breakpointStore={this._breakpointStore}
					zone={this._engine.currentZone}
					index={idx}
					action={action}
				/>
			) as ActionComponent;
			component.evaluateConditions();
			this._actionList.appendChild(component);
		});
	}

	public stepOnce() {
		console.log("step");
		this._breakAfter = true;
		const executor = this._engine.alternateScriptExecutor as DebuggingScriptExecutor;
		executor.stopped = false;
		this._reflectExecutorState();
	}

	public togglePause() {
		const executor = this._engine.alternateScriptExecutor as DebuggingScriptExecutor;
		executor.stopped = !executor.stopped;
		this._reflectExecutorState();
	}

	private _reflectExecutorState() {
		const executor = this._engine.alternateScriptExecutor as DebuggingScriptExecutor;
		const controls = this._window.content.querySelector(Controls.tagName) as Controls;
		if (executor.stopped) controls.removeAttribute("running");
		else controls.setAttribute("running", "");
	}

	executorWillExecute(
		executor: DebuggingScriptExecutor,
		thing: Zone | Action | Condition | Instruction
	): void {
		let breakpoint;

		if (thing instanceof Zone) {
			this._currentZone = thing;
			this._currentAction = null;
			return;
		}

		if (thing instanceof Action) {
			this._currentAction = thing;
			if (thing.zone !== this._currentZone) console.warn("action does not belong to current zone!");
			breakpoint = new LocationBreakpoint(thing.zone.id, thing.id);
		}

		if (thing instanceof Condition) {
			if (this._currentAction.zone !== this._currentZone)
				console.warn("action does not belong to current zone!");
			if (this._currentAction.conditions.indexOf(thing) === -1)
				console.warn("Condition not found in current action!");

			breakpoint = new LocationBreakpoint(
				this._currentZone.id,
				this._currentAction.id,
				"c",
				this._currentAction.conditions.indexOf(thing)
			);
		}

		if (thing instanceof Instruction) {
			if (this._currentAction.zone !== this._currentZone)
				console.warn("action does not belong to current zone!");
			if (this._currentAction.instructions.indexOf(thing) === -1)
				console.warn("Instruction not found in current action!");

			breakpoint = new LocationBreakpoint(
				this._currentZone.id,
				this._currentAction.id,
				"i",
				this._currentAction.instructions.indexOf(thing)
			);
		}

		if (breakpoint && this._breakpointStore.hasBreakpoint(breakpoint.id)) {
			console.log("stopping because of breakpoint", breakpoint.id);
			executor.stopped = true;
			this._reflectExecutorState();
		}
	}

	executorDidExecute(
		executor: DebuggingScriptExecutor,
		thing: Zone | Action | Condition | Instruction,
		_result: ScriptResult | Result | boolean
	): void {
		if (this._breakAfter) {
			executor.stopped = true;
			this._breakAfter = false;
			this._reflectExecutorState();
		}

		if (thing instanceof Zone) {
			this._currentZone = null;
			return;
		}

		if (thing instanceof Action) {
		}

		if (thing instanceof Condition) {
			// breakpoint = new LocationBreakpoint(thing.action.zone.id, thing.id);
		}

		if (thing instanceof Instruction) {
		}
	}
}

export default ScriptDebugger;
