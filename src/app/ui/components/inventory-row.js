import "./inventory-row.scss";
import { Component } from "/ui";

export default class extends Component {
	static get TagName() {
		return 'wf-inventory-row';
	}

	constructor() {
		super();

		this._emptyIcon = document.createElement('img');
		this._emptyIcon.src = Image.blankImage;

		this._icon = document.createElement('span');
		this._label = document.createElement('span');

		this.tile = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._icon);
		this.appendChild(this._label);
	}

	set tile(tile) {
		this._tile = tile;

		const icon = tile ? tile.image.representation.cloneNode() : this._emptyIcon;
		const label = tile ? tile.name : '';

		this._icon.clear();
		this._icon.appendChild(icon);
		this._label.innerText = label;
	}

	get tile() {
		return this._tile;
	}
}
