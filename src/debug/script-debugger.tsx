import { Window } from "src/ui/components";
import { Engine, EngineEvents } from "src/engine";
import { Controls } from "./components";
import Group from "src/ui/components/group";
import ActionComponent from "src/debug/components/action-component";
import Settings from "src/settings";
import { WindowManager } from "src/ui";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Point } from "src/util";
import DebuggingScriptExecutor from "./debugging-script-executor";
import AlternateScriptExecutor from "src/engine/script/alternate-script-executor";
import "./script-debugger.scss";

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
		this._window = (
			<Window
				className="script-debugger-window"
				title="Script Debugger"
				origin={new Point(10, 10)}
				autosaveName="script-debugger"
			/>
		) as Window;
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

	private _setupDebuggerControls() {
		this._window.content.appendChild(
			<Controls
				className="script-debugger-window"
				onstep={(): void => void 0}
				ontogglepause={(): void => void 0}
			/>
		);
	}

	private _setupActionList() {
		this._actionList = <Group className="action-list" /> as Group;
		this._window.content.appendChild(this._actionList);
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
			ConditionImplementations
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
					zone={this._engine.currentZone}
					index={idx}
					action={action}
				/>
			) as ActionComponent;
			component.evaluateConditions();
			this._actionList.appendChild(component);
		});
	}
}

export default ScriptDebugger;
