import { identity, Point, PointLike } from "src/util";
import WorldItem from "./world-item";
import { Zone } from "../objects";

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

	getZone(x: number|PointLike, y?: number) {
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
		const zoneID = worldItem.zoneID;
		if (zoneID === -1) return null;
		return this.zones[zoneID];
	}

	setZone(x: number, y: number, zoneID: number) {
		const index = this._pointToIndex(x, y);
		const worldItem = this._items[index];
		worldItem.zoneID = zoneID;
	}

	locationOfZone(zone: Zone): Point {
		const zoneID = this.zones.indexOf(zone);
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				if (this._items[index].zoneID === zoneID) {
					return new Point(x, y);
				}
			}
		}

		return null;
	}

	locationOfZoneWithID(zoneID: number): Point {
		const zone = this.zones[zoneID];
		if (!zone) return null;
		return this.locationOfZone(zone);
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
