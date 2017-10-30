import { identity, Point, PointLike } from "src/util";
import { Zone } from "../objects";
import WorldItem from "./world-item";

export const width = 10;
export const height = 10;

class World {
	static readonly WIDTH = 10;
	static readonly HEIGHT = 10;
	public zones: Zone[] = null;
	private _items: WorldItem[];

	constructor() {
		const items = new Array(World.WIDTH * World.HEIGHT);
		for (let i = 0; i < World.WIDTH * World.HEIGHT; i++) {
			items[i] = new WorldItem();
		}
		this._items = items;
	}

	getZone(x: number|PointLike, y?: number): Zone {
		console.assert(!!this.zones, "Data has not been set");

		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		if (x < 0 || x >= World.WIDTH ||
			y < 0 || y >= World.HEIGHT) {
			return null;
		}

		const index = this._pointToIndex(x, y);
		const worldItem = this._items[index];

		return  worldItem.zone;
	}

	setZone(x: number, y: number, zoneID: Zone) {
		const index = this._pointToIndex(x, y);
		const worldItem = this._items[index];
		worldItem.zone = zoneID;
	}

	locationOfZone(zone: Zone): Point {
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				if (this._items[index].zone === zone) {
					return new Point(x, y);
				}
			}
		}

		return null;
	}

	zoneIsAt(needleZone: Zone, x: number, y: number): boolean {
		let zone = this.getZone(x, y);
		if (!zone) return false;
		if (zone === needleZone) return true;

		return zone.leadsTo(needleZone, this.zones);
	}

	public at(x: number, y?: number): WorldItem {
		return this._items[this._pointToIndex(x, y)];
	}

	index(index: number): WorldItem {
		return this._items[index];
	}

	layDownHotspotItems(): void {
		this.zones.filter(identity).forEach(zone => zone.layDownHotspotItems());
	}

	private _pointToIndex(x: number, y: number) {
		return y * World.WIDTH + x;
	}
}

export default World;
