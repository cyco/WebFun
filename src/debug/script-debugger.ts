import { ComponentRegistry } from "src/ui";
import { Window } from "src/ui/components";
import { Engine } from "src/engine";
import * as Components from "./components";

class ScriptDebugger {
	private static _sharedDebugger: ScriptDebugger;
	private _window: Window;
	private _engine: Engine;
	private _isActive: boolean = false;

	public static get sharedDebugger() {
		ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
		return this._sharedDebugger = this._sharedDebugger || new ScriptDebugger();
	}

	constructor() {
		this._window = <Window>document.createElement(Window.TagName);
		this._window.title = "Script Debugger";
		this._window.x = 10;
		this._window.y = 10;

		this._setupDebuggerControls();
	}

	_setupDebuggerControls() {
		const controls = new Components.Controls();
		controls.onstep = (): void => null;
		controls.ontogglepause = (): void => null;
		// this._metronome.onstatuschange = () => controls.running = this._metronome.status === MetronomeStatus.Running;
		this._window.content.appendChild(controls);
	}

	public show() {
		this._setupDebugger();
		this._window.onclose = () => this._teardownDebugger();
		document.body.appendChild(this._window);
	}

	private _setupDebugger() {
		if (this._isActive) return;
		if (!this._engine) return;

		this._isActive = true;
	}

	private _teardownDebugger() {
		if (!this._isActive) return;

		this._isActive = false;
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

	get engine() {
		return this._engine;
	}
}

export default ScriptDebugger;
