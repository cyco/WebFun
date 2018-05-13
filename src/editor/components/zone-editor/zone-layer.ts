import Component from "src/ui/component";
import { default as Zone } from "src/engine/objects/zone";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { Point } from "src/util";
import "./zone-layer.scss";

class ZoneLayer extends Component {
	public static readonly tagName = "wf-zone-layer";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _layer: number;
	private _canvas: HTMLCanvasElement;
	private _tileSheet: CSSTileSheet;

	constructor() {
		super();

		this._canvas = document.createElement("canvas");
	}

	protected connectedCallback() {
		this.appendChild(this._canvas);
		this.draw();
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this._canvas.width = zone.size.width * TileWidth;
		this._canvas.height = zone.size.height * TileHeight;
		this._canvas.style.width = zone.size.width * TileWidth + "px";
		this._canvas.style.height = zone.size.height * TileHeight + "px";

		const ctx = this._canvas.getContext("2d");
		ctx.setTransform(TileWidth, 0, 0, TileHeight, 0, 0);

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
				ctx.drawImage(
					image,
					rect.minX,
					rect.minY,
					rect.size.width,
					rect.size.height,
					x,
					y,
					1,
					1
				);
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
			ctx.clearRect(p.x, p.y, 1, 1);

			if (!tile) return;

			const rect = tileSheet.rectangleForEntry(tile.id);
			ctx.drawImage(
				image,
				rect.minX,
				rect.minY,
				rect.size.width,
				rect.size.height,
				p.x,
				p.y,
				1,
				1
			);
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
