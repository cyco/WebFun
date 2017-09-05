import { Size } from "src/util";
import { Type as HotspotType } from "./hotspot";
import Type from "./zone-type";
import Layer from "./zone-layer";

export { Type, Layer };

export default class Zone {
	static get LAYERS() {
		return 3;
	}

	static get Type() {
		return Type;
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
		this._tileIDs = new Int16Array(0);
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
		this.padding = 0;

		this._debug_worldItem = null;

		this.puzzle = null;
		this.puzzleNPC = null;
		this.puzzleGain = null;
		this.puzzleRequired = null;

		Object.seal(this);
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
		this._tileIDs[index] = tile === null ? -1 : tile.id;
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
					if (this.getTile(hotspot.x, hotspot.y, 1)) return;
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

	isRoom() {
		return this.width === 9;
	}

	get LAYERS() {
		return 3;
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

	get doors() {
		return this._hotspots.filter((hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1);
	}
}
