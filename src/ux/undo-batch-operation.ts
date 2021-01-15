import UndoOperation from "./undo-operation";

class UndoBatchOperation extends UndoOperation {
	private _operations: UndoOperation[];

	constructor(operations: UndoOperation[]) {
		const undo = () =>
			this._operations
				.slice()
				.reverse()
				.forEach(op => op.undo());
		const redo = () => this._operations.forEach(op => op.redo());

		super(undo, redo);

		this._operations = operations;
	}

	public add(operation: UndoOperation): void {
		this._operations.push(operation);
	}
}

export default UndoBatchOperation;
