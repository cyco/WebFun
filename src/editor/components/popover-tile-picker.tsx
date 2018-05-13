import { Component } from "src/ui";
import { Popover } from "src/ui/components";
import { Tile } from "src/engine/objects";
import DataManager from "src/editor/data-manager";
import TileFilter from "src/editor/components/tile-filter";
import { Tile as TileComponent } from "src/save-game-editor/components";
import { PopoverModalSession } from "src/ux";
import TilePicker, { Events as TilePickerEvents } from "./tile-picker";
import { TileChangeEvent } from "src/editor/tools";
import "./popover-tile-picker.scss";

export const Events = {
	TileDidChange: "TileDidChange"
};

class PopoverTilePicker extends Component implements EventListenerObject {
	public static readonly TagName = "wf-resource-editor-popover-tile-picker";
	public static readonly observedAttributes: string[] = [];
	private _tiles: Tile[];
	private _data: DataManager;
	private _currentTile: Tile;
	private _currentTileView = <TileComponent /> as TileComponent;

	connectedCallback() {
		super.connectedCallback();
		this._currentTileView.addEventListener("click", this);
		this.appendChild(this._currentTileView);
	}

	disconnectedCallback() {
		this._currentTileView.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	public handleEvent(e: MouseEvent) {
		const popover = document.createElement(Popover.TagName) as Popover;
		const session = new PopoverModalSession(popover);
		const picker = document.createElement(TilePicker.TagName) as TilePicker;
		picker.data = this._data;
		picker.style.width = "300px";
		picker.style.height = "400px";
		picker.currentTile = this.currentTile;
		picker.addEventListener(TilePickerEvents.TileDidChange, (e: CustomEvent) => {
			this.currentTile = e.detail.tile as Tile;
			session.end(5);
		});
		popover.content.appendChild(picker);
		session.run();
	}

	set data(d) {
		this._data = d;
		this._currentTileView.tileSheet = d.tileSheet;
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
