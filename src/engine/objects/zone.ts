import { PointLike, Size } from "src/util";
import { default as Hotspot, Type as HotspotType } from "./hotspot";
import Type from "./zone-type";
import Layer from "./zone-layer";
import NPC from "./npc";
import Action from "./action";
import Tile from "./tile";
import { Planet } from "../types";

export { Type, Layer };

const TILE_ADEGAN_CRYSTAL = 12;

class Zone {
	public visited: boolean = false;
	public solved: boolean = false;
	public _npcs: NPC[] = [];
	public id: number = -1;
	public _name: string = "";
	public _planet: Planet = Planet.NONE;
	public _width: number = 0;
	public _height: number = 0;
	public _type: Type;
	public _tileIDs: Int16Array = new Int16Array(0);
	public _hotspots: Hotspot[] = [];
	public _tileStore: any = null;
	public _zoneStore: any = null;
	public assignedItemIDs: number[] = [];
	public requiredItemIDs: number[] = [];
	public providedItemIDs: number[] = [];
	public puzzleNPCTileIDs: number[] = [];
	public izx4Unknown: any = null;
	public izaxUnknown: any = null;
	public _actions: Action[] = [];
	public actionsInitialized: boolean = false;
	public counter: number = 0;
	public random: number = 0;
	public padding: number = 0;
	public _debug_worldItem: any = null;
	public puzzle: number = null;
	public puzzleNPC: number = null;
	public puzzleGain: number = null;
	public puzzleRequired: number = null;

	static get LAYERS() {
		return 3;
	}

	static get Type() {
		return Type;
	}

	get tileIDs() {
		return this._tileIDs;
	}

	set tileIDs(tileIDs) {
		this._tileIDs = tileIDs;
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

	get hotspots(): Hotspot[] {
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

	get doors(): Hotspot[] {
		return this._hotspots.filter((hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1);
	}

	get planet() {
		return this._planet;
	}

	set planet(p) {
		this._planet = p;
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

	getTileID(x: number, y: number, z: number): number {
		if (x < 0 || x >= this._width) debugger;
		if (y < 0 || y >= this._height) debugger;
		if (z < 0 || z >= 3) debugger;

		const index = Zone.LAYERS * (y * this.width + x) + z;
		return this.tileIDs[index];
	}

	getTile(x: number|PointLike, y?: number, z?: number): Tile {
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

	setTile(tile: Tile, x: number|PointLike, y: number = null, z: number = null): void {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}

		const index = Zone.LAYERS * (y * this.width + x) + z;
		this.tileIDs[index] = tile === null ? -1 : tile.id;
	}

	removeTile(x: number, y: number, z: number): void {
		this.setTile(null, x, y, z);
	}

	moveTile(sourceX: number, sourceY: number, z: number, targetX: number, targetY: number): void {
		const tile = this.getTile(sourceX, sourceY, z);
		this.setTile(tile, targetX, targetY, z);
		this.setTile(null, sourceX, sourceY, z);
	}

	placeWalkable(x: number|PointLike, y?: number): boolean {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		let floor = this.getTile(x, y, 0);
		if (floor && floor.isObject()) return false;

		let object = this.getTile(x, y, 1);
		return !object;
	}

	containsPoint(x: number|PointLike, y?: number): boolean {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	leadsTo(needleZone: Zone, allZones: Zone[]): boolean {
		if (needleZone === this) return false;

		for (let hotspot of this._hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1) {
				let zone = allZones[hotspot.arg];
				if (zone.leadsTo(needleZone, allZones)) return true;
			}
		}

		return false;
	}

	isLoadingZone(): boolean {
		return this._type === Type.Load;
	}

	layDownHotspotItems(): void {
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
					this.setTile(<Tile>{id: hotspot.arg}, hotspot.x, hotspot.y, 1);
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
}

export default Zone;
