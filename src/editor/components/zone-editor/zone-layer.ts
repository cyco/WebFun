import Component from "src/ui/component";
import { default as Zone } from "src/engine/objects/zone";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import TileSheet from "src/editor/tile-sheet";
import "./zone-layer.scss";
import { Point } from "src/util";

class ZoneLayer extends Component {
	public static readonly TagName = "wf-zone-layer";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _layer: number;
	private _canvas = <HTMLCanvasElement>document.createElement("canvas");
	private _tileSheet: TileSheet;

	connectedCallback() {
		this.appendChild(this._canvas);
		this.draw();
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this._canvas.width = (zone.size.width * TileWidth);
		this._canvas.height = (zone.size.height * TileHeight);
		this._canvas.style.width = zone.size.width * TileWidth + "px";
		this._canvas.style.height = zone.size.height * TileHeight + "px";

		if (this.isConnected) this.draw();
	}

	private draw() {
		if (this._layer === undefined) return;
		if (!this._zone) return;
		if (!this._tileSheet) return;

		const tileSheet = this._tileSheet;
		const image = tileSheet.sheetImage;
		const zone = this._zone;
		const ctx = this._canvas.getContext("2d");
		for (let y = 0; y < zone.size.height; y++) {
			for (let x = 0; x < zone.size.width; x++) {
				const tile = zone.getTile(x, y, this._layer);
				if (!tile) continue;

				const rect = tileSheet.rectangleForEntry(tile.id);
				ctx.drawImage(image, rect.minX, rect.minY, rect.size.width, rect.size.height, x * TileWidth, y * TileHeight, TileWidth, TileHeight);
			}
		}
	}

	public update(points: Point[]) {
		if (this._layer === undefined) return;
		if (!this._zone) return;
		if (!this._tileSheet) return;

		const tileSheet = this._tileSheet;
		const image = tileSheet.sheetImage;
		const zone = this._zone;
		const ctx = this._canvas.getContext("2d");
		points.forEach(p => {
			const tile = zone.getTile(p.x, p.y, this._layer);
			ctx.clearRect(p.x * TileWidth, p.y * TileHeight, TileWidth, TileHeight);

			if (!tile) return;

			const rect = tileSheet.rectangleForEntry(tile.id);
			ctx.drawImage(image, rect.minX, rect.minY, rect.size.width, rect.size.height, p.x * TileWidth, p.y * TileHeight, TileWidth, TileHeight);
		});
	}

	get zone() {
		return this._zone;
	}

	set layer(zoneLayer: number) {
		this._layer = zoneLayer;

		if (this.isConnected) this.draw();
	}

	get layer() {
		return this._layer;
	}

	set tileSheet(s) {
		this._tileSheet = s;
		if (this.isConnected) this.draw();
	}

	get tileSheet() {
		return this._tileSheet;
	}
}

export default ZoneLayer;
