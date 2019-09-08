import { Point, PointLike, Size, Rectangle } from "src/util";

import Sector from "./sector";
import { Zone } from "./objects";
import { floor } from "src/std/math";
import AssetManager from "./asset-manager";

class World {
	public static readonly Size = new Size(10, 10);
	private _sectors: Sector[];
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		const items = new Array(World.Size.width * World.Size.height);
		for (let i = 0; i < World.Size.width * World.Size.height; i++) {
			items[i] = new Sector();
		}
		this._sectors = items;
		this._assets = assets;
	}

	public findSectorContainingZone(zone: Zone): Sector {
		const location = this.findLocationOfZone(zone);
		if (!location) return null;
		return this.at(location);
	}

	public findLocationOfZone(zone: Zone): Point {
		const index = this._sectors.findIndex(s => s.containsZone(zone, this._assets));
		if (index === -1) return null;

		return new Point(index % World.Size.width, floor(index / World.Size.height));
	}

	public at(indexOrPointOrX: number | PointLike, y?: number): Sector {
		return this._sectors[this._pointToIndex(indexOrPointOrX, y)] || null;
	}

	public replaceSector(x: number, y: number, item: Sector): void {
		const index = this._pointToIndex(new Point(x, y));
		this._sectors[index] = item;
	}

	private _pointToIndex(x: number | PointLike, y?: number) {
		if (typeof x === "number" && y === undefined) {
			return x;
		}

		if (typeof x === "number") {
			return y * World.Size.width + x;
		}

		return x.y * World.Size.width + x.x;
	}

	public get bounds() {
		return new Rectangle(new Point(0, 0), World.Size);
	}
}

export default World;
