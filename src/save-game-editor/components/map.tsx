import "./map.scss";

import { Tile, Zone } from "src/engine/objects";
import Sector from "src/engine/sector";
import World from "src/engine/world";

import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { LocatorTile } from "src/engine/types";
import { Point } from "src/util";
import TileView from "src/debug/components/tile-view";

const TileSize = 28;
const HereInteval = 1000;

class Map extends Component {
	public static tagName = "wf-save-game-editor-map";
	public world: World;
	public tiles: Tile[];
	public zones: Zone[];
	public palette: ColorPalette;
	public location: Point;
	public locatorTile: LocatorTile;
	public reveal: boolean = false;

	private _canvas: HTMLCanvasElement = ((
		<canvas width={280} height={280} className="pixelated" />
	) as any) as HTMLCanvasElement;
	private _here: HTMLElement;
	private _hereInterval: number;

	protected connectedCallback() {
		super.connectedCallback();

		this.style.backgroundColor = this.locatorTile.backgroundColor;

		if (!this._here) {
			this._buildURHere();
		}

		this._drawWorld();
		this.appendChild(this._canvas);

		if (this.location) this.appendChild(this._here);
		if (this.location) this._buildInterval();
	}

	protected disconnectedCallback() {
		clearInterval(this._hereInterval);
		super.disconnectedCallback();
	}

	private _buildURHere() {
		if (!this.location) return;

		this._here = <TileView palette={this.palette} tile={this.tiles[this.locatorTile.here]} />;
		this._here.style.left = `${this.location.x * TileSize}px`;
		this._here.style.top = `${this.location.y * TileSize}px`;
	}

	private _buildInterval() {
		this._hereInterval = setInterval(() => {
			this._here.style.display = this._here.style.display === "none" ? "" : "none";
			this._canvas.getBoundingClientRect();
		}, HereInteval);
	}

	private _drawWorld() {
		const image = this.buildWorldImage(this.world, this.palette);
		const ctx = this._canvas.getContext("2d");
		ctx.putImageData(image, 0, 0);
	}

	private buildWorldImage(world: World, palette: ColorPalette) {
		const WorldWidth = World.Size.width;
		const WorldHeight = World.Size.height;

		const imageData = new ImageData(WorldWidth * TileSize, WorldHeight * TileSize);
		const rawImageData = imageData.data;

		const bpr = 4 * WorldWidth * TileSize;

		for (let y = 0; y < WorldHeight; y++) {
			for (let x = 0; x < WorldWidth; x++) {
				const sector = world.getSector(x, y);
				const tile = this._tileForSector(sector);
				if (!tile) continue;

				const pixels = tile.imageData;
				const sy = y * TileSize;
				const sx = x * TileSize;
				let j = sy * bpr + sx * 4;

				for (let ty = 0; ty < TileSize; ty++) {
					for (let tx = 0; tx < TileSize; tx++) {
						const i = ty * Tile.WIDTH + tx;
						const paletteIndex = pixels[i];
						if (paletteIndex === 0) continue;

						rawImageData[j + 4 * tx + 0] = 0xff & (palette[paletteIndex] >> 0);
						rawImageData[j + 4 * tx + 1] = 0xff & (palette[paletteIndex] >> 8);
						rawImageData[j + 4 * tx + 2] = 0xff & (palette[paletteIndex] >> 16);
						rawImageData[j + 4 * tx + 3] = 0xff;
					}

					j += bpr;
				}
			}
		}

		return imageData;
	}

	private _tileForSector({ visited, solved1, zone }: Sector): Tile {
		let tile = this.locatorTile.forZone(zone, visited, this.reveal);
		if (!tile) return null;
		if (tile instanceof Array) tile = tile[solved1 ? 1 : 0];

		return this.tiles[tile];
	}

	protected tileAtPoint(point: Point): Point {
		return point.dividedBy({ width: TileSize, height: TileSize }).byFlooring();
	}

	public redraw() {
		this._drawWorld();
	}
}

export default Map;
