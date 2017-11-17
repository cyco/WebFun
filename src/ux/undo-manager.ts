import { EventTarget } from "src/util";
import UndoOperation from "./undo-operation";
import UndoBatchOperation from "src/ux/undo-batch-operation";

class UndoManager extends EventTarget {
	private static _sharedManager: UndoManager;
	private static get sharedManager() {
		return this._sharedManager = this._sharedManager || new UndoManager();
	}

	private _stack: UndoOperation[];
	private _stackPointer: number;
	private _batchStack: UndoBatchOperation[];

	constructor() {
		super();

		this._stack = [];
		this._stackPointer = -1;
	}

	undo() {
		if (this.isAtStart()) return;

		const operation = this._stack[this._stackPointer--];
		operation.undo();
	}

	redo() {
		if (this.isAtEnd()) return;

		const operation = this._stack[++this._stackPointer];
		operation.redo();
	}

	note(op: UndoOperation|(() => void), redo?: () => void) {
		if (!(op instanceof UndoOperation)) {
			op = new UndoOperation(op, redo);
		}

		const currentBatch = this._batchStack.last();
		if (currentBatch) {
			currentBatch.add(op);
		} else {
			this._stack.push(op);
			this._stackPointer++;
		}
	}

	beginBatch() {
		this._batchStack.push(new UndoBatchOperation([]));
	}

	cancelBatch() {
		const currentBatch = this._batchStack.pop();
		console.assert(!!currentBatch, "No batch operation in progress!");
	}

	endBatch() {
		const currentBatch = this._batchStack.pop();
		console.assert(!!currentBatch, "No batch operation in progress!");
		this._stack.push(currentBatch);
	}

	private isAtStart() {
		return this._stackPointer === 0;
	}

	private isAtEnd() {
		return this._stackPointer === this._stack.length - 2;
	}
}

export default UndoManager;
