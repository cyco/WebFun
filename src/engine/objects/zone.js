import { Size } from "/util";
import { Type as HotspotType } from "./hotspot";

export const Type = {
	None: 0,
	Empty: 1,
	BlockadeNorth: 2,
	BlockadeSouth: 3,
	BlockadeEast: 4,
	BlockadeWest: 5,
	TravelStart: 6,
	TravelEnd: 7,
	Room: 8,
	Load: 9,
	Goal: 10,
	Town: 11,
	Win: 13,
	Lose: 14,
	Trade: 15,
	Use: 16,
	Find: 17,
	FindTheForce: 18,

	Unknown: 9999
};

export const Layer = {
	Floor: 0,
	Object: 1,
	Roof: 2
};

export default class Zone {
	static get LAYERS() {
		return 3;
	}

	get LAYERS() {
		return 3;
	}

	constructor() {
		this.visited = false;
		this.solved = false;
		this._npcs = [];

		this.id = -1;
		this._planet = -1;
		this._width = 0;
		this._height = 0;
		this._type = -1;
		this._tileIDs = [];
		this._hotspots = [];
		this._tileStore = null;
		this._zoneStore = null;
		this.assignedItemIDs = [];
		this.requiredItemIDs = [];
		this.providedItemIDs = [];
		this.puzzleNPCTileIDs = [];
		this.izx4Unknown = null;
		this.izaxUnknown = null;

		this._actions = [];
		this.actionsInitialized = false;

		this.counter = 0;
		this.random = null;

		this._debug_worldItem = null;

		this.puzzle = null;
		this.puzzleNPC = null;
		this.puzzleGain = null;
		this.puzzleRequired = null;

		Object.seal(this);
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	get planet() {
		return this._planet;
	}

	get hotspots() {
		return this._hotspots;
	}

	getLocatorDescription() {
		if (this.solved) return "...solved!";
		switch (this.type) {
			case Type.Find:
				return "find something useful...";
			case Type.FindTheForce:
				return "find the Force...";
			case Type.Goal:
				return "unknown...";
			case Type.Town:
				return "Spaceport";
		}
	}

	getTileID(x, y, z) {
		if (x < 0 || x >= this._width) debugger;
		if (y < 0 || y >= this._height) debugger;
		if (z < 0 || z >= 3) debugger;

		const index = Zone.LAYERS * (y * this.width + x) + z;
		return this._tileIDs[index];
	}

	getTile(x, y, z) {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}

		const index = this.getTileID(x, y, z);
		if (index === -1 || index === 0xFFFF || index >= this._tileStore.length)
			return null;

		return this._tileStore[index];
	}

	setTile(tile, x, y, z) {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}

		const index = Zone.LAYERS * (y * this.width + x) + z;
		this._tileIDs[index] = tile === null ? 0xFFFF : tile.id;
	}

	removeTile(x, y, z) {
		this.setTile(null, x, y, z);
	}

	moveTile(sourceX, sourceY, z, targetX, targetY) {
		const tile = this.getTile(sourceX, sourceY, z);
		this.setTile(tile, targetX, targetY, z);
		this.setTile(null, sourceX, sourceY, z);
	}

	placeWalkable(x, y) {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		let floor = this.getTile(x, y, 0);
		if (floor && floor.isObject()) return false;

		let object = this.getTile(x, y, 1);
		return !object;
	}

	containsPoint(x, y) {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	get size() {
		return new Size(this.width, this.height);
	}

	get actions() {
		return this._actions;
	}

	get npcs() {
		return this._npcs;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	leadsTo(needleZone, allZones) {
		if (needleZone === this) return false;

		for (let hotspot of this._hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1) {
				let zone = allZones[hotspot.arg];
				if (zone.leadsTo(needleZone, allZones)) return true;
			}
		}

		return false;
	}

	get doors() {
		return this._hotspots.filter((hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1);
	}

	isLoadingZone() {
		return this._type === Type.Load;
	}

	layDownHotspotItems() {
		this.hotspots.filter((htsp) => htsp.enabled).forEach((hotspot) => {
			switch (hotspot.type) {
				case HotspotType.Unused:
					hotspot.arg = TILE_ADEGAN_CRYSTAL;
				/* intentional fallthrough */
				case HotspotType.TriggerLocation:
				case HotspotType.SpawnLocation:
				case HotspotType.ForceLocation:
				case HotspotType.LocatorThingy:
				case HotspotType.CrateItem:
				case HotspotType.PuzzleNPC:
				case HotspotType.CrateWeapon:
					if (hotspot.arg < 0) break;
					this.setTile({id: hotspot.arg}, hotspot.x, hotspot.y, 1);
					break;
				case HotspotType.DoorIn:
					if (hotspot.arg < 0) break;
					const zone = this._zoneStore[hotspot.arg];
					zone.layDownHotspotItems();
					break;
				default:
					break;
			}
		});
	}
}

Zone.Type = Type;
