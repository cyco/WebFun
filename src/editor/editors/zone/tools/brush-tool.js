import Tool from "./tool";

export default class extends Tool {
	get name() {
		return "Brush";
	}

	get icon() {
		return "paint-brush";
	}

	constructor() {
		super();

		this._tile = null;
	}

	mouseDownAt(x, y, event) {
		this._editor.zone.setTile(this._editor.currentTile, x, y, this._editor.currentLayer);
	}

	mouseMoved(x, y, event) {
	}

	mouseDragged(x, y, event) {
		this._editor.zone.setTile(this._editor.currentTile, x, y, this._editor.currentLayer);
	}

	mouseUpAt(x, y, event) {
	}

	set tile(t) {
		this._tile = t;
	}

	get tile() {
		return this._tile;
	}
}
