class UndoOperation {
	public readonly undo: () => void;
	public readonly redo: () => void;

	constructor(undo: () => void, redo: () => void) {
		this.undo = undo;
		this.redo = redo;
	}
}

export default UndoOperation;
