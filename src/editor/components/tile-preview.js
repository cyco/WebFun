import { Component } from "src/ui";
import "./tile-preview.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-tile-preview";
	}

	_draw() {
		this.clear();
		if (!this._tile) return;

		const imageNode = this._tile.image.representation.cloneNode();
		this.appendChild(imageNode);
		this.appendChild(document.createElement("div"));
	}

	get tile() {
		return this._tile;
	}

	set tile(t) {
		this._tile = t;
		this._draw();
	}
}
