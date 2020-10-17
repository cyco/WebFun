import "./abstract-popover-tile-picker.scss";

import TilePicker, { Events as TilePickerEvents } from "./tile-picker";

import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { DiscardingStorage } from "src/util";
import { Popover } from "src/ui/components";
import { PopoverModalSession } from "src/ux";
import { Tile } from "src/engine/objects";
import TileComponent from "src/debug/components/tile-view";

abstract class PopoverTilePicker extends Component implements EventListenerObject {
	public static readonly observedAttributes: string[] = [];

	private _palette: ColorPalette;
	public onchange: (e: CustomEvent) => void = () => void 0;
	protected _state: Storage = new DiscardingStorage();

	protected _tiles: Tile[] = null;
	protected _tile: Tile = null;
	protected _tileView = (<TileComponent />) as TileComponent;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener("click", this);
		this.appendChild(this._tileView);
	}

	protected disconnectedCallback(): void {
		this.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	public handleEvent(e: MouseEvent): void {
		const { left, top } = this.getBoundingClientRect();
		const popover = (
			<Popover style={{ position: "absolute", left: `${left.toString()}px`, top: `${top.toString()}px` }} />
		) as Popover;
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
			session.end(1);
		});
		popover.content.appendChild(picker);
		session.onclick = (e: Event) => !(e.target as any).closest(Popover.tagName) && session.end(0);
		session.run();
		picker.focus();

		e.stopPropagation();
	}

	protected abstract pickerOnChange(picker: TilePicker, e: CustomEvent): void;

	set palette(s: ColorPalette) {
		this._palette = s;
		this._tileView.palette = s;
	}

	get palette(): ColorPalette {
		return this._palette;
	}

	set state(s: Storage) {
		this._state = s;
		this.restoreTileFromState();
	}

	get state(): Storage {
		return this._state;
	}

	set tiles(s: Tile[]) {
		this._tiles = s;
		this.restoreTileFromState();
	}

	get tiles(): Tile[] {
		return this._tiles;
	}

	protected set tile(tile: Tile) {
		this._tile = tile;
		this._tileView.tile = tile;
		this._state.store("tile", tile ? tile.id : -1);
	}

	protected get tile(): Tile {
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
