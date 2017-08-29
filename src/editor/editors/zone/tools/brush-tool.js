import Tool from "./tool";

export default class extends Tool {
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

	get name() {
		return "Brush";
	}

	get icon() {
		return "paint-brush";
	}

	get tile() {
		return this._tile;
	}

	set tile(t) {
		this._tile = t;
	}
}
