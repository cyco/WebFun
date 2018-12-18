import { Cell, IconButton, Selector } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { CompressedColorPalette } from "src/engine/rendering";
import { TileView } from "src/debug/components";
import "./inventory-row.scss";

class InventoryRow extends Cell<Tile> {
	public static readonly tagName = "wf-save-game-editor-inventory-row";
	private _icon: TileView = <TileView /> as TileView;
	private _label = (
		<Selector
			borderless
			onchange={() => {
				this.data = this.tiles.find(t => t.id === +this._label.value);
				this.onchange();
			}}
		/>
	) as Selector;
	private _tile: Tile;
	public ondelete: (row: InventoryRow) => void;
	public onadd: () => void;
	public onchange: () => void;
	public tiles: Tile[];

	protected connectedCallback() {
		super.connectedCallback();
		if (this.data) {
			this.tiles.forEach(t => this._label.addOption(t.name, `${t.id}`));
			this._label.value = `${this.data.id}`;
			this.appendChild(this._icon);
			this.appendChild(this._label);

			if (this.ondelete instanceof Function) {
				this._label.appendChild(
					<IconButton className="remove" onclick={() => this.ondelete(this)} icon="trash" />
				);
			}
		} else {
			this._setupAsNewItem();
		}
	}

	private _setupAsNewItem() {
		this.appendChild(<IconButton className="new" icon="plus" onclick={() => this.onadd()} />);
	}

	cloneNode(deep?: boolean): InventoryRow {
		const copy = super.cloneNode(deep) as InventoryRow;
		copy.ondelete = this.ondelete;
		copy.onchange = this.onchange;
		copy.onadd = this.onadd;
		copy.palette = this.palette;
		copy.data = this.data;
		copy.tiles = this.tiles;

		return copy;
	}

	get data() {
		return this._tile;
	}

	set data(tile: Tile) {
		this._tile = tile;
		this._label.value = `${this.data && this.data.id}`;
		this._icon.tile = tile;
	}

	set palette(sheet: CompressedColorPalette) {
		this._icon.palette = sheet;
	}

	get palette() {
		return this._icon.palette;
	}
}

export default InventoryRow;
