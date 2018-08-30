import { Component } from "src/ui";
import { Popover } from "src/ui/components";
import { Tile } from "src/engine/objects";
import { Tile as TileComponent } from "src/save-game-editor/components";
import { PopoverModalSession } from "src/ux";
import TilePicker, { Events as TilePickerEvents } from "./tile-picker";
import { ColorPalette } from "src/engine/rendering";
import { CSSTileSheet } from "src/editor";
import "./popover-tile-picker.scss";

class PopoverTilePicker extends Component implements EventListenerObject {
	public static readonly tagName = "wf-resource-editor-popover-tile-picker";
	public static readonly observedAttributes: string[] = [];

	public tiles: Tile[];
	public palette: ColorPalette;
	public onchange: (e: CustomEvent) => void = () => void 0;

	private _tile: Tile;
	private _tileView = <TileComponent /> as TileComponent;
	private _tileSheet: CSSTileSheet;

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
				state={localStorage.prefixedWith("popover-tile-picker")}
			/>
		) as TilePicker;

		picker.addEventListener(TilePickerEvents.TileDidChange, (e: CustomEvent) => {
			this.tile = e.detail.tile as Tile;
			session.end(5);
			this.dispatchEvent(new CustomEvent("change", { detail: { tile: this.tile }, bubbles: true }));
		});
		popover.content.appendChild(picker);
		session.run();

		e.stopPropagation();
	}

	set tileSheet(s) {
		this._tileView.tileSheet = s;
		this._tileSheet = s;
	}
	get tileSheet() {
		return this._tileSheet;
	}

	set tile(tile: Tile) {
		this._tile = tile;
		this._tileView.tile = tile;
	}

	get tile() {
		return this._tile;
	}
}

export default PopoverTilePicker;
