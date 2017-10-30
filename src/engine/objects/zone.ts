import { Point, PointLike, Rectangle, Size } from "src/util";
import { Planet } from "../types";
import Action from "./action";
import { default as Hotspot, Type as HotspotType } from "./hotspot";
import NPC from "./npc";
import Tile from "./tile";
import Layer from "./zone-layer";
import Type from "./zone-type";

export { Type, Layer };

const TILE_ADEGAN_CRYSTAL = 12;

class Zone {
	public static readonly LAYERS = 3;
	public static readonly Type = Type;
	public static readonly Layer = Layer;

	public visited: boolean = false;
	public solved: boolean = false;
	public _npcs: NPC[] = [];
	public id: number = -1;
	public _name: string = "";
	public _planet: Planet = Planet.NONE;
	private _size: Size;
	public _type: Type;
	public tileIDs: Int16Array = new Int16Array(0);
	public _hotspots: Hotspot[] = [];
	public _tileStore: any = null;
	public _zoneStore: any = null;
	public assignedItems: Tile[] = [];
	public requiredItems: Tile[] = [];
	public providedItems: Tile[] = [];
	public puzzleNPCs: Tile[] = [];
	public izx4Unknown: number;
	public izaxUnknown: number;
	public _actions: Action[] = [];
	public actionsInitialized: boolean = false;
	public counter: number = 0;
	public random: number = 0;
	public padding: number = 0;

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	get hotspots(): Hotspot[] {
		return this._hotspots;
	}

	get actions() {
		return this._actions;
	}

	get npcs() {
		return this._npcs;
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
		if (x < 0 || x >= this._size.width) debugger;
		if (y < 0 || y >= this._size.height) debugger;
		if (z < 0 || z >= 3) debugger;

		const index = Zone.LAYERS * (y * this._size.width + x) + z;
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

		const index = Zone.LAYERS * (y * this._size.width + x) + z;
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

	public isRoom() {
		return this._size.width === 9;
	}

	public get size() {
		return this._size;
	}

	public get bounds() {
		return new Rectangle(new Point(0, 0), this._size);
	}
}

export default Zone;
