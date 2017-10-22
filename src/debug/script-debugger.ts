import { ComponentRegistry } from "src/ui";
import { Window } from "src/ui/components";
import { Engine } from "src/engine";
import * as Components from "./components";
import {
	ConditionChecker,
	Conditions,
	ConditionStore,
	InstructionExecutor,
	InstructionResult,
	Instructions,
	InstructionStore
} from "src/engine/script";
import { Action, Instruction } from "src/engine/objects";
import Zone from "src/engine/objects/zone";

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

		const conditions = this._buildConditionStore(<ConditionStore>Conditions);
		this._engine.scriptExecutor.checker = new ConditionChecker(conditions, this._engine);
		const instructions = this._buildInstructionStore(<InstructionStore>Instructions);
		this._engine.scriptExecutor.executor = new InstructionExecutor(instructions, this._engine);

		this._isActive = true;
	}

	private _teardownDebugger() {
		if (!this._isActive) return;

		const conditions = <ConditionStore>Conditions;
		this._engine.scriptExecutor.checker = new ConditionChecker(conditions, this._engine);
		const instructions = <InstructionStore>Instructions;
		this._engine.scriptExecutor.executor = new InstructionExecutor(instructions, this._engine);

		this._isActive = false;
	}

	private _buildConditionStore(originalStore: ConditionStore): ConditionStore {
		const store: ConditionStore = {};

		for (const opcode in originalStore) {
			if (!originalStore.hasOwnProperty(opcode)) continue;

			const handler = originalStore[opcode];
			store[opcode] = async (args: number[], zone: Zone, engine: Engine): Promise<boolean> => {
				console.log("condition evaluated");
				return await handler(args, zone, engine);
			};
		}

		return store;
	}

	private _buildInstructionStore(originalStore: InstructionStore): InstructionStore {
		const store: InstructionStore = {};

		for (const opcode in originalStore) {
			if (!originalStore.hasOwnProperty(opcode)) continue;

			const handler = originalStore[opcode];
			store[opcode] = async (instruction: Instruction, engine: Engine, action: Action): Promise<InstructionResult> => {
				console.log("instruction executed");
				return await handler(instruction, engine, action);
			};
		}

		return store;
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
