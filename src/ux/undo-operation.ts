class UndoOperation {
	public undo: () => void;
	public redo: () => void;

	constructor(undo: () => void, redo: () => void) {
		this.undo = undo;
		this.redo = redo;
	}
}

export default UndoOperation;
