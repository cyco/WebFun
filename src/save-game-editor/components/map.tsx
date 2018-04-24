import { Component } from "src/ui";
import { World, WorldItem } from "src/engine/save-game";
import { Zone, Tile, TileAttribute } from "src/engine/objects";
import { Point, rgb } from "src/util";
import { Image, ColorPalette } from "src/engine/rendering";
import { LocatorTile } from "src/engine/types";
import { Renderer, ImageFactory } from "src/engine/rendering/canvas";
import { CSSTileSheet } from "src/editor";
import "./map.scss";

const TileSize = 28;
const HereInteval = 1000;

class Map extends Component {
	public static readonly TagName = "wf-save-game-editor-map";
	public world: World;
	public tileSheet: CSSTileSheet;
	public tiles: Tile[];
	public zones: Zone[];
	public palette: ColorPalette;
	public location: Point;

	private _canvas: HTMLCanvasElement = ((
		<canvas width={280} height={280} />
	) as any) as HTMLCanvasElement;
	private _imageMap: { [_: number]: Image };
	private _renderer: Renderer;
	private _here: HTMLElement;
	private _hereInterval: number;

	connectedCallback() {
		super.connectedCallback();

		if (!this._renderer) {
			this._buildURHere();
			this._buildRenderer();
			this._buildImageMap();
			this._imageMap[this.tiles.length - 1].representation.addEventListener("load", () =>
				this._drawWorld()
			);
		}

		this._drawWorld();
		this.appendChild(this._canvas);

		if (this.location) this.appendChild(this._here);
		if (this.location) this._buildInterval();
	}

	disconnectedCallback() {
		clearInterval(this._hereInterval);
		super.disconnectedCallback();
	}

	private _buildURHere() {
		if (!this.location) return;

		this._here = (
			<div className={"here " + this.tileSheet.cssClassNameForTile(LocatorTile.Here)} />
		);

		this._here.style.left = `${this.location.x * TileSize}px`;
		this._here.style.top = `${this.location.y * TileSize}px`;
	}

	private _buildInterval() {
		this._hereInterval = setInterval(() => {
			this._here.style.display = this._here.style.display === "none" ? "" : "none";
			this._canvas.getBoundingClientRect();
		}, HereInteval);
	}

	private _buildRenderer() {
		this._renderer = new Renderer(this._canvas);
		this._renderer.imageFactory.palette = this.palette;
	}

	private _buildImageMap() {
		this._imageMap = {};
		const factory = this._renderer.imageFactory;
		this.tiles.forEach(tile => {
			this._imageMap[tile.id] = factory.buildImage(Tile.WIDTH, Tile.HEIGHT, tile.imageData);
		});
	}

	private _drawWorld() {
		this._renderer.clear();
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const worldItem = this.world.getWorldItem(x, y);
				const tile = this._tileForWorldItem(worldItem);
				const tileImage = this._imageMap[tile.id];

				this._renderer.renderImage(tileImage, x * TileSize, y * TileSize);
			}
		}
	}

	private _tileForWorldItem({ visited, solved_1, zoneId }: WorldItem): Tile {
		let tile = LocatorTile.ForZone(this.zones[zoneId], visited);
		if (tile instanceof Array) tile = tile[solved_1 ? 1 : 0];

		return this.tiles[tile];
	}
}

export default Map;
