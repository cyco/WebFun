import { Component } from "src/ui";
import { Tile } from "src/engine/objects";
import DataManager from "src/editor/data-manager";
import TileFilter from "src/editor/components/tile-filter";
import { Tile as TileComponent } from "src/save-game-editor/components";
import "./popover-tile-picker.scss";

export const Events = {
	TileDidChange: "TileDidChange"
};

class PopoverTilePicker extends Component {
	public static readonly TagName = "wf-resource-editor-popover-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _tiles: Tile[];
	private _data: DataManager;
	private _currentTile: Tile;
	private _currentTileView: TileComponent;

	constructor() {
		super();
		this._currentTileView = document.createElement(TileComponent.TagName) as TileComponent;
	}

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._currentTileView);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	set data(d) {
		this._data = d;
		this._currentTileView.tileSheet = d.tileSheet;
		this.currentTile = d.currentData.tiles[0x12];
	}

	get data() {
		return this._data;
	}

	set currentTile(tile: Tile) {
		this._currentTile = tile;
		this._currentTileView.tile = tile;
		this.dispatchEvent(
			new CustomEvent(Events.TileDidChange, { detail: { tile }, bubbles: true })
		);
	}

	get currentTile() {
		return this._currentTile;
	}
}

export default PopoverTilePicker;
