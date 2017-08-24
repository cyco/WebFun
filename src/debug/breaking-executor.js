import { Promise } from "/std";
import { EventTarget } from "/util";
import { ConditionChecker, InstructionExecutor } from "/engine/script";
import { LocationBreakpoint } from "./breakpoint";
import BreakpointStore from "./breakpoint-store";

export const Continuation = {
	Step: 'step',
	Run: 'run'
};

export const Events = {
	Stop: 'stop'
};

export default class extends EventTarget {
	constructor() {
		super();

		this.engine = null;

		this._checker = new ConditionChecker();
		this._executor = new InstructionExecutor();

		this._breakpointStore = BreakpointStore.sharedStore;
		this._unbreak = null;
		this._breakAsap = false;

		this.registerEvents(Events);
	}

	async continueActions(engine) {
		engine.metronome.stop();
		try {
			const r = await this._doContinueActions(engine);
			if (r) engine.metronome.start();
			else ; // metronome will be started again when ZoneScene calls runActions
			return r;
		} catch(e) {
			console.error(e);
		}
	}

	async _doContinueActions(engine) {
		this.engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			action => action.instructionPointer);

		if (this._unbreak) {
			console.warn('Queueing blocks while executor is stopped');
			debugger;
		}

		return await this._evaluateActions(previousActions, false);
	}

	async runActions(engine) {
		engine.metronome.stop();
		const r = await this._doRunActions(engine);
		engine.metronome.start();
		return r;
	}

	async _doRunActions(engine) {
		this.engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		if (this._unbreak) {
			console.warn('Queueing blocks while executor is stopped');
			debugger;
		}

		return await this._evaluateActions(engine.currentZone.actions, true);
	}

	async _evaluateActions(actions, check = true) {
		const hasActions = actions.length;
		actions = actions.slice();
		while (actions.length) {
			let action = actions.shift();

			await this._breakIfNecessary(action);
			if ((!check || await this._actionDoesApply(action)) && await this._executeInstructions(action))
				return true;
		}

		if (hasActions) {
			this.engine.currentZone.actionsInitialized = true;
			this.engine.state.justEntered = false;
			this.engine.state.enteredByPlane = false;
			this.engine.state.bump = null;
		}

		return false;
	}

	async _actionDoesApply(action) {
		if (!action.enabled && action.instructionPointer === 0)
			return false;

		for (let i = 0; i < action.conditions.length; i++) {
			const condition = action.conditions[i];
			try {
				await this._breakIfNecessary(action, 'c', i);
				if (!this._checker.check(condition))
					return false;
			} catch (e) {
				console.warn('check crashed', e);
			}
		}

		return true;
	}

	async _executeInstructions(action) {
		this._executor.action = action;
		for (let i = action.instructionPointer | 0, len = action.instructions.length; i < len; i++) {
			action.instructionPointer = i + 1;

			await this._breakIfNecessary(action, 'i', i);

			const wait = this._executor.execute(action.instructions[i]);
			if (wait === true) return true;
		}
		this._executor.action = null;
		action.instructionPointer = 0;

		return false;
	}

	async _breakIfNecessary(action, type = null, index = null) {
		if (this._shouldBreakAt(this.engine.currentZone.id, action.id, type, index))
			await this._breakAt(this.engine.currentZone.id, action.id, type, index);
	}

	_shouldBreakAt(zone, action, type = null, index = null) {
		if (this._breakAsap && type && index) {
			this._breakAsap = false;
			return true;
		}
		const bpt = new LocationBreakpoint(zone, action, type, index);
		return this._breakpointStore.hasBreakpoint(bpt.id);
	}

	async _breakAt(zone, action, type = null, index = null) {
		const needle = new LocationBreakpoint(zone, action, type, index);
		const bpt = this._breakpointStore.getBreakpoint(needle.id);
		if (this._unbreak) {
			console.warn('Breaking again!');
		}

		console.log(`Break. ${zone} ${action} ${type} ${index}`);
		this.dispatchEvent(Events.Stop, {
			zone,
			action,
			type,
			index
		});

		return new Promise((resolve, reject) => {
			this._unbreak = resolve;
		});
	}

	async bump(targetPoint) {
		console.log(`bump ${targetPoint.x.toString(0x10)}x${targetPoint.y.toString(0x10)}`);
		const engine = this.engine;
		const state = engine.state;
		const zone = engine.currentZone;
		const hero = engine.hero;

		engine.metronome.stop();
		// metronome will be started again when ZoneScene calls runActions

		state.bump = targetPoint;
		const actions = zone.actions.slice();

		let action;
		let didExecuteSomething = false;
		while ((action = actions.shift())) {
			await this._breakIfNecessary(action);

			const execute = await this._actionDoesApply(action);
			if (!execute) continue;

			const result = await this._executeInstructions(action);
			if (result === true) break;
			didExecuteSomething = true;
		}

		state.bump = null;

		if (didExecuteSomething) {
			hero.isWalking = false;
		}
	}

	continue(mode = Continuation.Step) {
		if (mode === Continuation.Step) this._breakAsap = true;

		if (this._unbreak) {
			const unbreak = this._unbreak;
			this._unbreak = null;
			unbreak();
		} else {
			const metronome = this.engine.metronome;
			if (mode === Continuation.Step) {
				metronome.ontick();
				metronome.onrender();
			}

			if (mode === Continuation.Run) {
				metronome.start();
			}
		}
	}
}
