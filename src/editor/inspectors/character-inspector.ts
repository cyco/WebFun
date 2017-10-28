import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class CharacterInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
	}

	build(){}
}

export default CharacterInspector;
