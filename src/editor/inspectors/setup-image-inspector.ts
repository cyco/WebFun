import AbstractInspector from "src/editor/inspectors/abstract-inspector";

class SetupImageInspector extends AbstractInspector {
	constructor() {
		super();

		this.window.title = "Setup Image";
		this.window.autosaveName = "setup-image-inspector";
	}
}

export default SetupImageInspector;
