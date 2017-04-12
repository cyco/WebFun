import { Point } from "/util";
import { WorldItem } from './generation';

export const width = 10;
export const height = 10;

export default class World {
	static get WIDTH() {
		return width;
	}

	static get HEIGHT() {
		return height;
	}

	constructor() {
		this._items = (World.WIDTH * World.HEIGHT).times(() => new WorldItem());
		this.data = null;
		Object.seal(this);
	}

	_pointToIndex(x, y) {
		return y * World.WIDTH + x;
	}

	getZone(x, y) {
		console.assert(this.data, "Data has not been set");

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
		const zoneId = worldItem.zoneId;
		if(zoneId === -1) return null;
		return this.data.zones[zoneId];
	}

	setZone(x, y, zoneID) {
		const index = this._pointToIndex(x, y);
		const worldItem = this._items[index];
		worldItem.zoneId = zoneID;
	}

	locationOfZone(zone) {
		const zoneID = this.data.zones.indexOf(zone);
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				if (this._items[index].zoneId === zoneID) {
					return new Point(x, y);
				}
			}
		}

		return null;
	}

	locationOfZoneWithID(zoneID) {
		const zone = this.data.zones[zoneID];
		if (!zone) return null;
		return this.locationOfZone(zone);
	}

	zoneIsAt(needleZone, x, y) {
		let zone = this.getZone(x, y);
		if (!zone) return false;
		if (zone === needleZone) return true;

		return zone.leadsTo(needleZone, this.data.zones);
	}

	at(x, y) {
		return this._items[this._pointToIndex(x, y)];
	}
}
