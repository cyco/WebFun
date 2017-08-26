import Tool from "./tool";

export default class extends Tool {
	get name() {
		return "Tile Picker";
	}

	get icon() {
		return "crosshairs";
	}

	mouseDownAt(x, y, event) {
		this._pickTile(x, y);
	}

	mouseDragged(x, y, event) {
		this._pickTile(x, y);
	}

	_pickTile(x, y) {
		const z = this._editor.currentLayer;
		const zone = this._editor.zone;
		this._editor.currentTile = zone.getTile(x, y, z);
	}
}
