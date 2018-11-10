import { Tile } from "src/engine/objects";
import { Image } from "src/std/dom";
import { Cell } from "src/ui/components";
import "./inventory-row.scss";

class InventoryRow extends Cell<Tile> {
	public static readonly tagName = "wf-inventory-row";
	private _emptyIcon: HTMLImageElement = <img src={Image.blankImage} /> as HTMLImageElement;
	private _icon: HTMLSpanElement = <span />;
	private _label: HTMLSpanElement = <span />;
	private _tile: Tile = null;

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._icon);
		this.appendChild(this._label);
	}

	public cloneNode(deep: boolean) {
		const clone = super.cloneNode(deep) as InventoryRow;
		clone.onclick = this.onclick;
		return clone;
	}

	get data() {
		return this._tile;
	}

	set data(tile) {
		this._tile = tile;

		const rep = tile ? tile.image.representation : null;
		const icon = rep && rep.cloneNode ? rep.cloneNode() : this._emptyIcon;
		const label = tile ? tile.name : "";

		this._icon.textContent = "";
		this._icon.appendChild(icon);
		this._label.innerText = label;
	}
}

export default InventoryRow;
