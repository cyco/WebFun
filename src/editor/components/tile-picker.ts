import { Component } from "src/ui";
import { List } from "src/ui/components";
import { Tile } from "src/engine/objects";
import TilePickerCell from "./tile-picker-cell";
import DataManager from "src/editor/data-manager";
import "./tile-picker.scss";
import TileFilter from "src/editor/components/tile-filter";

export const Events = {
	TileDidChange: "TileDidChange"
};

class TilePicker extends Component {
	public static readonly TagName = "wf-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _tiles: Tile[];
	private _list: List<Tile>;
	private _data: DataManager;
	private _currentTile: Tile;

	constructor() {
		super();

		this._list = <List<Tile>>document.createElement(List.TagName);
		this._list.cell = <TilePickerCell>document.createElement(TilePickerCell.TagName);
		this._list.cell.onclick = (e: MouseEvent) =>
			this._cellClicked(<TilePickerCell>e.currentTarget);
		this._list.searchDelegate = new TileFilter();
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._list);
	}

	private _cellClicked(cell: TilePickerCell) {
		const previousCell = this._list.querySelector(TilePickerCell.TagName + ".active");
		if (previousCell) previousCell.classList.remove("active");

		this.currentTile = cell.data;

		cell.classList.add("active");
	}

	protected disconnectedCallback() {
		this._list.remove();

		super.disconnectedCallback();
	}

	set tiles(s) {
		this._tiles = s;
		this._list.items = s;
	}

	get tiles() {
		return this._tiles;
	}

	set data(d) {
		this._data = d;

		const cell = <TilePickerCell>this._list.cell;
		cell.tileSheet = this._data.tileSheet;
		const tiles = d.currentData.tiles.slice();
		tiles.splice(0, 0, null);
		this._list.items = tiles;
	}

	get data() {
		return this._data;
	}

	set currentTile(tile: Tile) {
		this._currentTile = tile;
		this.dispatchEvent(
			new CustomEvent(Events.TileDidChange, { detail: { tile }, bubbles: true })
		);
	}

	get currentTile() {
		return this._currentTile;
	}
}

export default TilePicker;
