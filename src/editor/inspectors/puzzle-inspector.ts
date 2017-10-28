import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class PuzzleInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Puzzles";
		this.window.autosaveName = "puzzle-inspector";
	}

	build(){}
}

export default PuzzleInspector;
