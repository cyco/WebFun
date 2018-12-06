import { Component } from "src/ui";
import { Popover } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { Tile as TileComponent } from "src/save-game-editor/components";
import { PopoverModalSession } from "src/ux";
import TilePicker, { Events as TilePickerEvents } from "./tile-picker";
import { ColorPalette } from "src/engine/rendering";
import { CSSTileSheet } from "src/editor";
import "./abstract-popover-tile-picker.scss";

abstract class PopoverTilePicker extends Component implements EventListenerObject {
	public static readonly observedAttributes: string[] = [];

	protected tiles: Tile[];
	public palette: ColorPalette;
	public onchange: (e: CustomEvent) => void = () => void 0;
	public state: Storage = localStorage.prefixedWith("popover-tile-picker");

	protected _tile: Tile;
	protected _tileView = <TileComponent /> as TileComponent;
	protected _tileSheet: CSSTileSheet;

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
				tileSheet={this.tileSheet}
				tiles={this.tiles}
				palette={this.palette}
				tile={this.tile}
				style={{ width: "300px", height: "400px" }}
				state={this.state}
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

	set tileSheet(s) {
		this._tileView.tileSheet = s;
		this._tileSheet = s;
	}

	get tileSheet() {
		return this._tileSheet;
	}

	protected set tile(tile: Tile) {
		this._tile = tile;
		this._tileView.tile = tile;
	}

	protected get tile() {
		return this._tile;
	}
}

export default PopoverTilePicker;
