import { Point, PointLike } from "src/util";

import Sector from "./sector";
import { Zone } from "../objects";

class World {
	public static readonly WIDTH = 10;
	public static readonly HEIGHT = 10;

	public zones: Zone[] = [];
	private _items: Sector[];

	constructor() {
		const items = new Array(World.WIDTH * World.HEIGHT);
		for (let i = 0; i < World.WIDTH * World.HEIGHT; i++) {
			items[i] = new Sector();
		}
		this._items = items;
	}

	getZone(x: number | PointLike, y?: number): Zone {
		console.assert(!!this.zones, "Data has not been set");

		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		if (x < 0 || x >= World.WIDTH || y < 0 || y >= World.HEIGHT) {
			return null;
		}

		const index = this._pointToIndex(x, y);
		const sector = this._items[index];

		return sector && sector.zone;
	}

	setZone(x: number, y: number, zone: Zone) {
		const index = this._pointToIndex(x, y);
		const sector = this._items[index];
		sector.zone = zone;
	}

	itemForZone(zone: Zone): Sector {
		const location = this.locationOfZone(zone);
		if (!location) return null;
		return this.at(location);
	}

	locationOfZone(zone: Zone): Point {
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.WIDTH; x++) {
				const index = this._pointToIndex(x, y);
				const currentZone = this._items[index].zone;
				if (currentZone === zone) {
					return new Point(x, y);
				}
			}
		}

		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.WIDTH; x++) {
				const index = this._pointToIndex(x, y);
				const currentZone = this._items[index].zone;
				if (currentZone && currentZone.leadsTo(zone, this.zones)) {
					return new Point(x, y);
				}
			}
		}

		return null;
	}

	public at(x: number | PointLike, y?: number): Sector {
		return this._items[this._pointToIndex(x, y)];
	}

	index(index: number): Sector {
		return this._items[index];
	}

	private _pointToIndex(x: number | PointLike, y?: number) {
		if (typeof x === "number") {
			return y * World.WIDTH + x;
		}

		return x.y * World.WIDTH + x.x;
	}
}

export default World;
