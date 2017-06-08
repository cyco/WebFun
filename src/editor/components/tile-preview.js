import { Component } from '/ui';
import "./tile-preview.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-editor-tile-preview';
	}

	_draw() {
		this.clear();
		if (!this._tile) return;

		const imageNode = this._tile.image.representation.cloneNode();
		this.appendChild(imageNode);
		this.appendChild(document.createElement('div'));
	}

	set tile(t) {
		this._tile = t;
		this._draw();
	}

	get tile() {
		return this._tile;
	}
}
