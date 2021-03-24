import { EventTarget } from "src/util";
import UndoBatchOperation from "src/ux/undo-batch-operation";
import UndoOperation from "./undo-operation";

class UndoManager extends EventTarget {
	private _stack: UndoOperation[] = [];
	private _stackPointer: number = -1;
	private _batchStack: UndoBatchOperation[] = [];

	public undo(): void {
		if (!this.canUndo()) return;

		const operation = this._stack[this._stackPointer--];
		operation.undo();
	}

	public redo(): void {
		if (!this.canRedo()) return;

		const operation = this._stack[++this._stackPointer];
		operation.redo();
	}

	public note(op: UndoOperation | (() => void), redo?: () => void): void {
		if (!(op instanceof UndoOperation)) {
			op = new UndoOperation(op, redo);
		}

		const currentBatch = this._batchStack.last();
		if (currentBatch) {
			currentBatch.add(op);
		} else {
			this._stack.splice(this._stackPointer + 1, this._stack.length);
			this._stack.push(op);
			this._stackPointer++;
		}
	}

	public beginBatch(): void {
		this._batchStack.push(new UndoBatchOperation([]));
	}

	public cancelBatch(): void {
		const currentBatch = this._batchStack.pop();
		console.assert(!!currentBatch, "No batch operation in progress!");
	}

	public endBatch(): void {
		const currentBatch = this._batchStack.pop();
		console.assert(!!currentBatch, "No batch operation in progress!");
		this._stack.push(currentBatch);
		this._stackPointer++;
	}

	private canUndo() {
		return this._stackPointer !== -1;
	}

	private canRedo() {
		return this._stackPointer + 1 !== this._stack.length;
	}
}

export default UndoManager;
