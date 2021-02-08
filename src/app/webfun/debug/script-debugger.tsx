import "./script-debugger.scss";

import { Action, Condition, Instruction, Zone } from "src/engine/objects";
import {
	Action as ActionComponent,
	Condition as ConditionComponent,
	Instruction as InstructionComponent
} from "src/app/webfun/debug/components";
import { ConditionImplementations, ConditionsByName } from "src/engine/script/conditions";
import DebuggingScriptProcessingUnit, {
	DebuggingScriptProcessingUnitDelegate
} from "./debugging-script-processing-unit";
import { Engine, EngineEvents } from "src/engine";
import { InstructionImplementations, InstructionsByName } from "src/engine/script/instructions";
import { Result, ScriptResult } from "src/engine/script";

import BreakpointStore from "./breakpoint-store";
import Controls from "./components/controls";
import Group from "src/ui/components/group";
import { LocationBreakpoint } from "./breakpoint";
import { Point } from "src/util";
import ScriptProcessingUnit from "src/engine/script/script-processing-unit";
import Settings from "src/settings";
import { Window } from "src/ui/components";
import { WindowManager } from "src/ui";

const StateChangingOpcodes = {
	[InstructionsByName.SetSharedCounter.Opcode]: true,
	[InstructionsByName.AddToSharedCounter.Opcode]: true,
	[InstructionsByName.AddToCounter.Opcode]: true,
	[InstructionsByName.SetCounter.Opcode]: true,
	[InstructionsByName.RollDice.Opcode]: true,
	[InstructionsByName.SetRandom.Opcode]: true
};

class ScriptDebugger implements DebuggingScriptProcessingUnitDelegate {
	private static _sharedDebugger: ScriptDebugger;
	private _window: Window;
	private _engine: Engine;
	private _isActive: boolean = false;
	private _actionList: Group;
	private _handlers = {
		zoneChange: () => {
			this._updateZoneState();
			this._rebuildActionList();
		}
	};
	private _breakAfter: boolean;

	private _currentZone: Zone = null;
	private _currentAction: Action = null;
	private _breakpointStore: BreakpointStore = BreakpointStore.sharedStore;
	private _variableMap: any = {};

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

		if (!this._window || !this._window.content) {
			console.log("no window or no content: ", this._window);
			return;
		}
		this._window.content.style.minWidth = "200px";
		this._window.content.appendChild(
			<Controls
				onstep={(): void => this.stepOnce()}
				ontogglepause={(): void => this.togglePause()}
			/>
		);
		this._window.content.appendChild(this._buildZoneState());
		this._actionList = (<Group className="action-list" />) as Group;
		this._window.content.appendChild(this._actionList);
	}

	public static get sharedDebugger(): ScriptDebugger {
		return (this._sharedDebugger = this._sharedDebugger || new ScriptDebugger());
	}

	get engine(): Engine {
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

	public show(): void {
		this._setupDebugger();
		this._window.onclose = () => this._teardownDebugger();
		WindowManager.defaultManager.showWindow(this._window);
	}

	private _setupDebugger() {
		if (this._isActive) return;
		if (!this._engine) return;

		this._engine.spu = new DebuggingScriptProcessingUnit(
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
		this._engine.spu = new ScriptProcessingUnit(
			this._engine,
			InstructionImplementations,
			ConditionImplementations
		);
		this._isActive = false;
	}

	private _rebuildActionList() {
		this._rebuildVariableMap();
		this._actionList.textContent = "";
		this._engine.currentZone.actions.forEach((action, idx) => {
			const component = (
				<ActionComponent
					engine={this._engine}
					breakpointStore={this._breakpointStore}
					zone={this._engine.currentZone}
					index={idx}
					variableMap={this._variableMap}
					action={action}
				/>
			) as ActionComponent;
			component.evaluateConditions();
			this._actionList.appendChild(component);
		});

		if (this._actionList.firstElementChild)
			(this._actionList.firstElementChild as any).scrollIntoViewIfNeeded();
	}

	private _rebuildVariableMap(): void {
		let i = 0;
		this._variableMap = {};
		this._engine.currentZone.actions
			.map(a =>
				a.conditions
					.filter(c => c.opcode === ConditionsByName.IsVariable.Opcode)
					.map(c => [c.arguments[1], c.arguments[2], c.arguments[3]])
					.concat(
						a.instructions
							.filter(c => c.opcode === InstructionsByName.SetVariable.Opcode)
							.map(a => [a.arguments[0], a.arguments[1], a.arguments[2]])
					)
			)
			.flatten()
			.sort()
			.forEach(([x, y, z]) => {
				const id = `${x.toString()}x${y.toString()}x${z.toString()}`;
				if (this._variableMap[id] !== undefined) return;
				this._variableMap[id] = i++;
			});
	}

	public stepOnce(): void {
		this._breakAfter = true;
		const executor = this._engine.spu as DebuggingScriptProcessingUnit;
		this.continueExecution(executor);
	}

	public togglePause(): void {
		const executor = this._engine.spu as DebuggingScriptProcessingUnit;
		if (executor.stopped) this.continueExecution(executor);
		else this.stopExecution(executor);
	}

	private _reflectExecutorState() {
		const executor = this._engine.spu as DebuggingScriptProcessingUnit;
		const controls = this._window.content.querySelector(Controls.tagName) as Controls;
		if (executor.stopped) controls.removeAttribute("running");
		else controls.setAttribute("running", "");
	}

	private _reflectExecutorPosition(breakpoint: LocationBreakpoint) {
		const previousAction = this._actionList.querySelector(`${ActionComponent.tagName}[current]`);
		if (previousAction) previousAction.removeAttribute("current");
		const previousThing = this._actionList.querySelector(
			`${InstructionComponent.tagName}[current],${ConditionComponent.tagName}[current]`
		);
		if (previousThing) previousThing.removeAttribute("current");

		if (!breakpoint) return;

		const [, actionId, type = null, idx = null] = breakpoint.id.substr(1).split(":");

		const action = this._actionList.querySelectorAll(ActionComponent.tagName)[+actionId];
		if (!action) return;
		action.setAttribute("current", "");
		if (!type) return;
		const thing = action.querySelectorAll(
			type === "c" ? ConditionComponent.tagName : InstructionComponent.tagName
		)[+idx];
		if (thing) thing.setAttribute("current", "");
	}

	executorWillExecute(
		executor: DebuggingScriptProcessingUnit,
		thing: Zone | Action | Condition | Instruction
	): void {
		if (thing instanceof Zone) {
			this._currentZone = thing;
			this._currentAction = null;
			return;
		}

		if (thing instanceof Action) {
			this._currentAction = thing;
			if (thing.zone !== this._currentZone) console.warn("action does not belong to current zone!");
			if (this._currentAction.zone !== this.engine.currentZone)
				console.warn("Engine thinks we're on a different zone!");
		}

		if ("isCondition" in thing) {
			if (this._currentAction.zone !== this._currentZone)
				console.warn("action does not belong to current zone!");
			if (this._currentAction.conditions.indexOf(thing) === -1)
				console.warn("Condition not found in current action!");
		}

		if ("isInstruction" in thing) {
			if (this._currentAction.zone !== this._currentZone)
				console.warn("action does not belong to current zone!");
			if (this._currentAction.instructions.indexOf(thing) === -1)
				console.warn("Instruction not found in current action!");
		}

		const breakpoint = this.buildBreakpoint(thing);
		this._reflectExecutorPosition(breakpoint);
		if (breakpoint && this._breakpointStore.hasBreakpoint(breakpoint.id)) {
			console.log("stopping because of breakpoint", breakpoint.id);
			this.stopExecution(executor);
		}
	}

	private buildBreakpoint(thing: Zone | Action | Condition | Instruction) {
		let breakpoint = null;

		if (thing instanceof Action) {
			this._currentAction = thing;
			breakpoint = new LocationBreakpoint(thing.zone.id, thing.id);
		}

		if ("isCondition" in thing) {
			breakpoint = new LocationBreakpoint(
				this._currentZone.id,
				this._currentAction.id,
				"c",
				this._currentAction.conditions.indexOf(thing)
			);
		}

		if ("isInstruction" in thing) {
			breakpoint = new LocationBreakpoint(
				this._currentZone.id,
				this._currentAction.id,
				"i",
				this._currentAction.instructions.indexOf(thing)
			);
		}

		return breakpoint;
	}

	executorDidExecute(
		executor: DebuggingScriptProcessingUnit,
		thing: Zone | Action | Condition | Instruction,
		_result: ScriptResult | Result | boolean
	): void {
		if (this._breakAfter) {
			this.stopExecution(executor);
			this._breakAfter = false;
		}

		if (thing instanceof Zone) {
			this._currentZone = null;
			return;
		}

		if (thing instanceof Action) {
			return;
		}

		if ("isCondition" in thing) {
			return;
		}

		if ("isInstruction" in thing) {
			if (StateChangingOpcodes[thing.opcode]) {
				this._updateZoneState();
			}
		}
	}

	private continueExecution(executor: DebuggingScriptProcessingUnit) {
		executor.stopped = false;
		this._reflectExecutorState();
	}

	private stopExecution(executor: DebuggingScriptProcessingUnit) {
		executor.stopped = true;
		this._actionList
			.querySelectorAll(ActionComponent.tagName)
			.forEach((component: ActionComponent) => component.evaluateConditions());
		this._reflectExecutorState();
		this._scrollToCurrentInstruction();
		this._updateZoneState();
	}

	private _scrollToCurrentInstruction() {
		const actionComponent = this._actionList.querySelector(`${ActionComponent.tagName}[current]`);
		if (!actionComponent) return;
		const instructionComponent = actionComponent.querySelector(
			`${ConditionComponent.tagName}[current],${InstructionComponent.tagName}[current]`
		);
		const target = (instructionComponent || actionComponent) as any;
		target.scrollIntoViewIfNeeded();
	}

	private _updateZoneState() {
		const state = this._window.content.querySelector(".zone-state");
		state.replaceWith(this._buildZoneState());
	}

	private _buildZoneState() {
		const zone = this.engine && this.engine.currentZone;
		let counter = "";
		let random = "";
		let sharedCounter = "";

		if (zone) {
			counter = zone.counter.toString();
			random = zone.random.toString();
			sharedCounter = zone.sharedCounter.toString();
		}

		return (
			<Group className="zone-state">
				<label>Counter:</label>
				<span>{counter}</span>
				<label>Random:</label>
				<span>{random}</span>
				<label>Shared counter:</label>
				<span>{sharedCounter}</span>
			</Group>
		);
	}
}

export default ScriptDebugger;
