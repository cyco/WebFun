import { Cell, IconButton } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import TileComponent from "./tile";
import "./inventory-row.scss";

class InventoryRow extends Cell<Tile> {
	public static TagName = "wf-save-game-editor-inventory-row";
	private _icon: TileComponent = <TileComponent /> as TileComponent;
	private _label = <span />;
	private _tile: Tile;
	public ondelete: ((row: InventoryRow) => void);

	connectedCallback() {
		super.connectedCallback();
		if (this.data) {
			this.appendChild(this._icon);
			this.appendChild(this._label);

			if (this.ondelete instanceof Function) {
				this._label.appendChild(
					<IconButton
						className="remove"
						onclick={() => this.ondelete(this)}
						icon="trash"
					/>
				);
			}
		} else {
			this._setupAsNewItem();
		}
	}

	private _setupAsNewItem() {
		this.appendChild(<IconButton className="new" icon="plus" />);
	}

	cloneNode(deep?: boolean): InventoryRow {
		const copy = super.cloneNode(deep) as InventoryRow;
		copy.ondelete = this.ondelete;
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
