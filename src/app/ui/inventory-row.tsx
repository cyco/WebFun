import { Tile } from "src/engine/objects";
import { Image } from "src/std/dom";
import { Component } from "src/ui";
import "./inventory-row.scss";

class InventoryRow extends Component {
	public static readonly tagName = "wf-inventory-row";
	private _emptyIcon: HTMLImageElement = <img src={Image.blankImage} /> as HTMLImageElement;
	private _icon: HTMLSpanElement = <span />;
	private _label: HTMLSpanElement = <span />;
	private _tile: Tile = null;

	get tile() {
		return this._tile;
	}

	set tile(tile) {
		this._tile = tile;

		const rep = tile ? tile.image.representation : null;
		const icon = rep && rep.cloneNode ? rep.cloneNode() : this._emptyIcon;
		const label = tile ? tile.name : "";

		this._icon.textContent = "";
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
