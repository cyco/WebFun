import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class SoundInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Sounds";
		this.window.autosaveName = "sound-inspector";
	}
}

export default SoundInspector;
