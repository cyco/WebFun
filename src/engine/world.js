import { Point } from "/util";

export default class World {
	static get WIDTH() {
		return 10;
	}

	static get HEIGHT() {
		return 10;
	}

	constructor() {
		this.map = Array.Repeat(null, World.WIDTH * World.HEIGHT);
		this.data = null;

		Object.seal(this);
	}

	_pointToIndex(x, y) {
		return y * World.WIDTH + x;
	}

	getZone(x, y) {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		if (x < 0 || x >= World.WIDTH ||
			y < 0 || y >= World.HEIGHT) {
			return null;
		}

		return this.map[this._pointToIndex(x, y)];
	}

	setZone(x, y, zoneID) {
		console.assert(this.data, "Data has not been set");

		const zone = this.data.zones[zoneID];
		this.map[this._pointToIndex(x, y)] = zone;
	}

	locationOfZone(zone) {
		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.HEIGHT; x++) {
				let index = this._pointToIndex(x, y);
				if (this.map[index] === zone) {
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
}
