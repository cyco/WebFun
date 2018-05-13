import { Tile } from "src/engine/objects";
import { Component } from "src/ui";
import "./inventory-row.scss";

class InventoryRow extends Component {
	public static tagName = "wf-inventory-row";
	private _emptyIcon: HTMLImageElement;
	private _icon: HTMLSpanElement;
	private _label: HTMLSpanElement;
	private _tile: Tile;

	constructor() {
		super();

		this._emptyIcon = document.createElement("img");
		this._emptyIcon.src = (<any>Image).blankImage;

		this._icon = document.createElement("span");
		this._label = document.createElement("span");

		this.tile = null;
	}

	get tile() {
		return this._tile;
	}

	set tile(tile) {
		this._tile = tile;

		const rep = tile ? tile.image.representation : null;
		const icon = rep && rep.cloneNode ? rep.cloneNode() : this._emptyIcon;
		const label = tile ? tile.name : "";

		this._icon.clear();
		this._icon.appendChild(icon);
		this._label.innerText = label;
	}

	protected connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._icon);
		this.appendChild(this._label);
	}
}

export default InventoryRow;
