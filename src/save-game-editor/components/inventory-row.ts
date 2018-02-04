import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import TileComponent from "./tile";
import "./inventory-row.scss";

class InventoryRow extends Cell<Tile> {
	public static TagName = "wf-save-game-editor-inventory-row";
	private _icon: TileComponent;
	private _label: HTMLSpanElement;
	private _tile: Tile;

	constructor() {
		super();

		this._icon = <TileComponent>document.createElement(TileComponent.TagName);
		this._label = document.createElement("span");
	}

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._icon);
		this.appendChild(this._label);
	}

	cloneNode(deep?: boolean): InventoryRow {
		const copy = <InventoryRow>super.cloneNode(deep);
		copy.tileSheet = this.tileSheet;
		copy.data = this.data;

		return copy;
	}

	get data() {
		return this._tile;
	}

	set data(tile: Tile) {
		this._tile = tile;

		this._icon.className = tile ? this.tileSheet.cssClassNameForTile(tile.id) : "";
		this._label.innerText = tile ? tile.name : "";
	}

	set tileSheet(sheet: CSSTileSheet) {
		this._icon.tileSheet = sheet;
	}

	get tileSheet() {
		return this._icon.tileSheet;
	}
}

export default InventoryRow;
