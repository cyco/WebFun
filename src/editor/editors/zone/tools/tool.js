export default class {
	constructor() {
		this._editor = null;
	}

	activate(editor) {
		this._editor = editor;
	}

	deactivate() {
		this._edtior = null;
	}

	mouseDownAt(x, y, event) {
	}

	mouseMoved(x, y, event) {
	}

	mouseDragged(x, y, event) {
	}

	mouseUpAt(x, y, event) {
	}

	get name() {
		console.assert(false, "Tool must define a name");
	}

	get icon() {
		console.assert(false, "Tool must define an icon");
	}

	get shortcut() {
		return "";
	}
}
