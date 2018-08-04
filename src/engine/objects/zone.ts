import { Point, PointLike, Rectangle, Size } from "src/util";
import { Planet } from "../types";
import Action from "./action";
import { default as Hotspot, Type as HotspotType } from "./hotspot";
import NPC from "./npc";
import Tile from "./tile";
import Layer from "./zone-layer";
import Type, { default as ZoneType } from "./zone-type";

export { Type, Layer };

const TILE_ADEGAN_CRYSTAL = 12;

class Zone {
	public static readonly LAYERS = 3;
	public static readonly Type = Type;
	public static readonly Layer = Layer;

	public visited: boolean = false;
	public solved: boolean = false;
	public actionsInitialized: boolean = false;
	public counter: number = 0;
	public random: number = 0;
	public padding: number = 0;

	protected _npcs: NPC[] = [];
	protected _id: number = -1;
	protected _name: string = "";
	protected _planet: Planet = Planet.NONE;
	protected _size: Size;
	protected _type: Type;
	protected _tileIDs: Int16Array = new Int16Array(0);
	protected _hotspots: Hotspot[] = [];
	protected _tileStore: any = null;
	protected _zoneStore: any = null;
	protected _goalItems: Tile[] = [];
	protected _requiredItems: Tile[] = [];
	protected _providedItems: Tile[] = [];
	protected _puzzleNPCs: Tile[] = [];
	protected _izx4Unknown: number;
	protected _izaxUnknown: number;
	protected _actions: Action[] = [];
	public doorInLocation: Point = new Point(0, 0);

	get doors(): Hotspot[] {
		return this._hotspots.filter(
			hotspot => hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1
		);
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
		return this.tileIDs[Zone.LAYERS * (y * this._size.width + x) + z];
	}

	getTile(x: number | PointLike, y?: number, z?: number): Tile {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}

		const index = this.getTileID(x, y, z);
		if (index === -1 || index === 0xffff || index >= this._tileStore.length) return null;

		return this._tileStore[index];
	}

	setTile(tile: Tile, x: number | PointLike, y: number = null, z: number = null): void {
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

	placeWalkable(x: number | PointLike, y?: number): boolean {
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
		this.hotspots.filter(htsp => htsp.enabled).forEach(hotspot => {
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
					this.setTile(<Tile>{ id: hotspot.arg }, hotspot.x, hotspot.y, 1);
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

	get hasTeleporter() {
		return (
			this._type === ZoneType.Empty &&
			this.hotspots.withType(HotspotType.Teleporter).length !== 0
		);
	}

	public get bounds() {
		return new Rectangle(new Point(0, 0), this._size);
	}

	get npcs() {
		return this._npcs;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get planet() {
		return this._planet;
	}

	get size() {
		return this._size;
	}

	get type() {
		return this._type;
	}

	get tileIDs() {
		return this._tileIDs;
	}

	get hotspots() {
		return this._hotspots;
	}

	get tileStore() {
		return this._tileStore;
	}

	get zoneStore() {
		return this._zoneStore;
	}

	get goalItems() {
		return this._goalItems;
	}

	get requiredItems() {
		return this._requiredItems;
	}

	get providedItems() {
		return this._providedItems;
	}

	get puzzleNPCs() {
		return this._puzzleNPCs;
	}

	get izx4Unknown() {
		return this._izx4Unknown;
	}

	get izaxUnknown() {
		return this._izaxUnknown;
	}

	get actions() {
		return this._actions;
	}
}

export default Zone;
