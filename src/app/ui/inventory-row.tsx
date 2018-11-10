import { Tile } from "src/engine/objects";
import { Cell } from "src/ui/components";
import { PaletteView } from "src/editor/components";
import { Size } from "src/util";
import "./inventory-row.scss";

const EmptyImageData = new Uint8Array(Tile.WIDTH * Tile.HEIGHT);

class InventoryRow extends Cell<Tile> {
	public static readonly tagName = "wf-inventory-row";
	private _label: HTMLSpanElement = <span />;
	private _tile: Tile = null;
	private _pickedUp: boolean = false;
	private _paletteView: PaletteView = (
		<PaletteView size={new Size(Tile.WIDTH, Tile.HEIGHT)} />
	) as PaletteView;
	private _iconBorder: HTMLSpanElement = <span />;

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._paletteView);
		this.appendChild(this._iconBorder);
		this.appendChild(this._label);
	}

	public cloneNode(deep: boolean) {
		const clone = super.cloneNode(deep) as InventoryRow;
		clone.onclick = this.onclick;
		clone.palette = this.palette;
		return clone;
	}

	get data() {
		return this._tile;
	}

	set data(tile) {
		this._tile = tile;

		this._label.innerText = tile ? tile.name : "";
		this._paletteView.image = tile ? tile.imageData : EmptyImageData;
	}

	public set pickedUp(flag: boolean) {
		this._pickedUp = flag;
		this._paletteView.image = flag ? EmptyImageData : this._tile ? this._tile.imageData : EmptyImageData;
	}

	public get pickedUp() {
		return this._pickedUp;
	}

	public set palette(p) {
		this._paletteView.palette = p;
	}

	public get palette() {
		return this._paletteView.palette;
	}

	public get imageDataURL() {
		return this._paletteView.imageDataURL;
	}
}

export default InventoryRow;
