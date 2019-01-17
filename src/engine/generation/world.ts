import { identity, Point, PointLike } from "src/util";
import { Zone } from "../objects";
import WorldItem from "./world-item";

class World {
	public static readonly WIDTH = 10;
	public static readonly HEIGHT = 10;

	public zones: Zone[] = [];
	private _items: WorldItem[];

	constructor() {
		const items = new Array(World.WIDTH * World.HEIGHT);
		for (let i = 0; i < World.WIDTH * World.HEIGHT; i++) {
			items[i] = new WorldItem();
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
		const worldItem = this._items[index];

		return worldItem && worldItem.zone;
	}

	setZone(x: number, y: number, zone: Zone) {
		const index = this._pointToIndex(x, y);
		const worldItem = this._items[index];
		worldItem.zone = zone;
	}

	locationOfZone(zone: Zone): Point {
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				const currentZone = this._items[index].zone;
				if (currentZone === zone) {
					return new Point(x, y);
				}
			}
		}

		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				const currentZone = this._items[index].zone;
				if (currentZone && currentZone.leadsTo(zone, this.zones)) {
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

	public at(x: number | PointLike, y?: number): WorldItem {
		return this._items[this._pointToIndex(x, y)];
	}

	index(index: number): WorldItem {
		return this._items[index];
	}

	layDownHotspotItems(): void {
		this.zones.filter(identity).forEach(zone => zone.layDownHotspotItems());
	}

	public map<T>(callback: (_: WorldItem, idx: number) => T) {
		return this._items.map(callback);
	}

	private _pointToIndex(x: number | PointLike, y?: number) {
		if (typeof x === "number") {
			return y * World.WIDTH + x;
		}

		return x.y * World.WIDTH + x.x;
	}
}

export default World;
