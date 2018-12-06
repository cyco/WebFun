import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { ColorPalette } from "src/engine/rendering";
import { drawTileImageData } from "src/app/rendering/canvas";
import "./tile-picker-cell.scss";

class TilePickerCell extends Cell<Tile> {
	public static readonly tagName = "wf-tile-picker-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: CSSTileSheet;
	private _palette: ColorPalette;
	private _canvas = (
		<canvas width={Tile.WIDTH} height={Tile.HEIGHT} className="pixelated" />
	) as HTMLCanvasElement;
	private _data: Tile;

	protected connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._canvas);
		this.draw();
	}

	private draw() {
		if (this.tileSheet) {
			this._canvas.className = this.data ? this.tileSheet.cssClassNameForTile(this.data.id) : "";
		} else if (this.palette && this.data) {
			const context = this._canvas.getContext("2d");
			context.clearRect(0, 0, Tile.WIDTH, Tile.HEIGHT);
			const imageData = drawTileImageData(this.data, this.palette);
			context.putImageData(imageData, 0, 0);
		} else if (this.data) console.warn("Tile picker cell can't be drawn without palette or tilesheet");
	}

	protected disconnectedCallback() {
		this._canvas.remove();
		super.disconnectedCallback();
	}

	public cloneNode(deep?: boolean): TilePickerCell {
		const node = super.cloneNode(deep) as TilePickerCell;
		node.tileSheet = this.tileSheet;
		node.palette = this.palette;
		node.onclick = this.onclick;
		return node;
	}

	set data(d: Tile) {
		this._data = d;
		if (this.isConnected) this.draw();
	}

	get data() {
		return this._data;
	}

	set palette(d: ColorPalette) {
		this._palette = d;
		if (this.isConnected) this.draw();
	}

	get palette() {
		return this._palette;
	}
}

export default TilePickerCell;
