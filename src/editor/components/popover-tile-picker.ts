import { Component } from "src/ui";
import { Tile } from "src/engine/objects";
import DataManager from "src/editor/data-manager";
import TileFilter from "src/editor/components/tile-filter";
import "./tile-picker.scss";

export const Events = {
	TileDidChange: "TileDidChange"
};

class PopoverTilePicker extends Component {
	public static readonly TagName = "wf-resource-editor-popover-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _tiles: Tile[];
	private _data: DataManager;
	private _currentTile: Tile;

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	set tiles(s) {
		this._tiles = s;
	}

	get tiles() {
		return this._tiles;
	}

	set data(d) {
		this._data = d;
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

export default PopoverTilePicker;
