import { Component } from "src/ui";
import { Popover } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { TileView as TileComponent } from "src/debug/components";
import { PopoverModalSession } from "src/ux";
import TilePicker, { Events as TilePickerEvents } from "./tile-picker";
import { CompressedColorPalette } from "src/engine/rendering";
import { DiscardingStorage } from "src/util";
import "./abstract-popover-tile-picker.scss";

abstract class PopoverTilePicker extends Component implements EventListenerObject {
	public static readonly observedAttributes: string[] = [];

	private _palette: CompressedColorPalette;
	public onchange: (e: CustomEvent) => void = () => void 0;
	protected _state: Storage = new DiscardingStorage();

	protected _tiles: Tile[] = null;
	protected _tile: Tile = null;
	protected _tileView = <TileComponent /> as TileComponent;

	protected connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this);
		this.appendChild(this._tileView);
	}

	protected disconnectedCallback() {
		this.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	public handleEvent(e: MouseEvent) {
		const popover = <Popover /> as Popover;
		const session = new PopoverModalSession(popover);
		const picker = (
			<TilePicker
				tiles={this.tiles}
				palette={this._palette}
				tile={this.tile}
				style={{ width: "300px", height: "400px" }}
				state={this.state.prefixedWith("popover-tile-picker")}
			/>
		) as TilePicker;

		picker.addEventListener(TilePickerEvents.TileDidChange, (e: CustomEvent) => {
			this.pickerOnChange(picker, e);
			session.end(5);
		});
		popover.content.appendChild(picker);
		session.run();

		e.stopPropagation();
	}

	protected abstract pickerOnChange(picker: TilePicker, e: CustomEvent): void;

	set palette(s) {
		this._palette = s;
		this._tileView.palette = s;
	}

	get palette() {
		return this._palette;
	}

	set state(s: Storage) {
		this._state = s;
		this.restoreTileFromState();
	}

	get state() {
		return this._state;
	}

	set tiles(s: Tile[]) {
		this._tiles = s;
		this.restoreTileFromState();
	}

	get tiles() {
		return this._tiles;
	}

	protected set tile(tile: Tile) {
		this._tile = tile;
		this._tileView.tile = tile;
		this._state.store("tile", tile ? tile.id : -1);
	}

	protected get tile() {
		return this._tile;
	}

	private restoreTileFromState() {
		if (!this._state) return;
		if (!this._tiles) return;

		if (!this._state.has("tile")) return;

		const id = +this._state.load("tile");
		const tile = this.tiles.find(t => t.id === id);
		this._tile = tile;
		this._tileView.tile = tile;
	}
}

export default PopoverTilePicker;
