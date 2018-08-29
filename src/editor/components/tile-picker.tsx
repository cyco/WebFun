import { Component } from "src/ui";
import { List } from "src/ui/components";
import { Tile } from "src/engine/objects";
import TilePickerCell from "./tile-picker-cell";
import TileFilter from "src/editor/components/tile-filter";
import "./tile-picker.scss";

export const Events = {
	TileDidChange: "TileDidChange"
};

class TilePicker extends Component {
	public static readonly tagName = "wf-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _tiles: Tile[];
	private _list: List<Tile>;
	private _tile: Tile;

	constructor() {
		super();

		this._list = (
			<List
				searchDelegate={new TileFilter()}
				cell={
					<TilePickerCell
						onclick={({ currentTarget }: MouseEvent) =>
							this._cellClicked(currentTarget as TilePickerCell)
						}
					/>
				}
			/>
		) as List<Tile>;
		this._list.showBar(true);
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._list);
	}

	private _cellClicked(cell: TilePickerCell) {
		const previousCell = this._list.querySelector(TilePickerCell.tagName + ".active");
		if (previousCell) previousCell.classList.remove("active");

		this.tile = cell.data;

		cell.classList.add("active");
	}

	protected disconnectedCallback() {
		this._list.remove();

		super.disconnectedCallback();
	}

	set tiles(s) {
		this._tiles = s;

		const tiles = s.slice();
		tiles.splice(0, 0, null);
		this._list.items = tiles;
	}

	get tiles() {
		return this._tiles;
	}

	set palette(p) {
		const cell = this._list.cell as TilePickerCell;
		cell.palette = p;
	}

	get palette() {
		const cell = this._list.cell as TilePickerCell;
		return cell.palette;
	}

	set tileSheet(p) {
		const cell = this._list.cell as TilePickerCell;
		cell.tileSheet = p;
	}

	get tileSheet() {
		const cell = this._list.cell as TilePickerCell;
		return cell.tileSheet;
	}

	set tile(tile: Tile) {
		this._tile = tile;

		this.dispatchEvent(new CustomEvent(Events.TileDidChange, { detail: { tile }, bubbles: true }));
	}

	get tile() {
		return this._tile;
	}

	set state(s: Storage) {
		this._list.state = s.prefixedWith("list");
	}

	get state() {
		return this._list.state;
	}
}

export default TilePicker;
