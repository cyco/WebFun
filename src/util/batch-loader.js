import EventTarget from "./event-target";
import dispatch from "./dispatch";

export const Event = {
	Start: "start",
	Progress: "progress",
	Finish: "finish"
};

export default class BatchLoader extends EventTarget {
	static get Event() {
		return Event;
	}

	constructor() {
		super();

		this._operations = [];

		this._scheduled = 0;
		this._completed = 0;

		this.registerEvents(BatchLoader.Event);
	}

	addOperation(op) {
		this._operations.push(op);
		this._scheduled++;
	}

	addOperations(ops) {
		ops.forEach((op) => this.addOperation(op));
	}

	start() {
		dispatch(() => {
			this.dispatchEvent(BatchLoader.Event.Start);
			this._loop();
		});
	}

	_loop() {
		if (this._operations.length === 0) {
			this.dispatchEvent(BatchLoader.Event.Finish);
			return;
		}

		this._currentOperation = this._operations.shift();
		this._currentOperation.onfinish = () => this._operationDidFinish();
		this._currentOperation.onerror = () => this._operationDidFinish();

		this._currentOperation.start();
	}

	cancel() {}

	_operationDidFinish() {
		const self = this;
		this._completed++;

		this._currentOperation.onfinish = null;
		this._currentOperation.onfail = null;
		this.dispatchEvent(BatchLoader.Event.Progress, {
			progress: this._completed / this._scheduled
		});

		// dispatch(function () { disabled for debugging
		self._loop();
	// }, 0);
	}
}
