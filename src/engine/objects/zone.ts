import Hotspot from "./hotspot";
import { Point, PointLike, Rectangle, Size } from "src/util";
import ZoneType from "./zone-type";

import Action from "./action";
import ZoneLayer from "./zone-layer";
import Monster from "./monster";
import { Planet } from "../types";
import Tile from "./tile";
import AssetManager, { NullIfMissing } from "src/engine/asset-manager";

const TILE_ADEGAN_CRYSTAL = 12;

class Zone {
	public static readonly LAYERS = 3;
	public static readonly Type = ZoneType;
	public static readonly Layer = ZoneLayer;

	public visited: boolean = false;
	public actionsInitialized: boolean = false;
	public counter: number = 0;
	public random: number = 0;
	public sharedCounter: number = 0;

	protected _monsters: Monster[] = [];
	protected _id: number = -1;
	protected _name: string = "";
	protected _planet: Planet = Planet.None;
	protected _size: Size = null;
	protected _type: ZoneType = null;
	protected _tileIDs: Int16Array = new Int16Array(0);
	protected _hotspots: Hotspot[] = [];
	protected _tileStore: any = null;
	protected _zoneStore: any = null;
	protected _goalItems: Tile[] = [];
	protected _requiredItems: Tile[] = [];
	protected _providedItems: Tile[] = [];
	protected _npcs: Tile[] = [];
	protected _izx4Unknown: number = 0;
	protected _izaxUnknown: number = 0;
	protected _actions: Action[] = [];
	public doorInLocation: Point = new Point(0, 0);

	get doors(): Hotspot[] {
		return this._hotspots.filter(
			hotspot => hotspot.type === Hotspot.Type.DoorIn && hotspot.arg !== -1
		);
	}

	getTileID(x: number, y: number, z: number): number {
		if (x < 0 || x >= this._size.width || y < 0 || y >= this._size.height) {
			return null;
		}
		return this.tileIDs[Zone.LAYERS * (y * this._size.width + x) + z];
	}

	getTile(x: number | PointLike, y?: number, z?: number): Tile {
		({ x, y, z } = this.normalizeInput(x, y, z));

		if (!this.bounds.contains(new Point(x, y))) {
			console.warn("Missing bounds check");
			console.trace();
			return;
		}

		const index = this.getTileID(x, y, z);
		if (index === -1 || index === 0xffff || index >= this._tileStore.length) return null;

		return this._tileStore[index];
	}

	setTile(tile: Tile, x: number | PointLike, y?: number, z?: number): void {
		({ x, y, z } = this.normalizeInput(x, y, z));

		if (!this.bounds.contains(new Point(x, y))) {
			console.warn("Missing bounds check");
			console.trace();
			return;
		}

		const index = Zone.LAYERS * (y * this._size.width + x) + z;
		this.tileIDs[index] = tile === null ? -1 : tile.id;
	}

	placeWalkable(x: number | PointLike, y?: number): boolean {
		({ x, y } = this.normalizeInput(x, y));

		const object = this.getTile(x, y, 1);
		return !object;
	}

	private normalizeInput(x: number | PointLike, y: number = null, z: number = null) {
		if (typeof x === "object") return x;
		return { x, y, z };
	}

	leadsTo(needleZone: Zone, assets: AssetManager): boolean {
		if (needleZone === this) return true;

		for (const hotspot of this._hotspots) {
			if (hotspot.type === Hotspot.Type.DoorIn && hotspot.arg !== -1) {
				const zone = assets.get(Zone, hotspot.arg, NullIfMissing);
				if (zone.leadsTo(needleZone, assets)) return true;
			}
		}

		return false;
	}

	isLoadingZone(): boolean {
		return this._type === ZoneType.Load;
	}

	initialize(): void {
		this.placeNPCs();
		this.layDownHotspotItems();
	}

	private placeNPCs(): void {
		this.monsters
			.filter(npc => npc.enabled)
			.forEach(npc => {
				if (this.getTile(npc.x, npc.y, ZoneLayer.Object) === null) {
					const tile = npc.face.frames[0].down;
					this.setTile(tile, npc.x, npc.y, ZoneLayer.Object);
				}
			});
	}

	private layDownHotspotItems(): void {
		this.hotspots
			.filter(htsp => htsp.enabled)
			.forEach(hotspot => {
				switch (hotspot.type) {
					case Hotspot.Type.Unused:
						hotspot.arg = TILE_ADEGAN_CRYSTAL;
					/* intentional fallthrough */
					case Hotspot.Type.DropQuestItem:
					case Hotspot.Type.SpawnLocation:
					case Hotspot.Type.DropUniqueWeapon:
					case Hotspot.Type.DropMap:
					case Hotspot.Type.DropItem:
					case Hotspot.Type.NPC:
					case Hotspot.Type.DropWeapon:
						if (hotspot.arg < 0) break;
						if (this.getTile(hotspot.x, hotspot.y, 1)) return;
						this.setTile(({ id: hotspot.arg } as unknown) as Tile, hotspot.x, hotspot.y, 1);
						break;
					case Hotspot.Type.DoorIn:
						if (hotspot.arg < 0) break;
						const zone = this._zoneStore[hotspot.arg];
						zone.layDownHotspotItems();
						break;
					default:
						break;
				}
			});
	}

	public isRoom(): boolean {
		return this._size.width === 9;
	}

	get hasTeleporter(): boolean {
		return (
			this._type === ZoneType.Empty && this.hotspots.withType(Hotspot.Type.Teleporter).length !== 0
		);
	}

	public get bounds(): Rectangle {
		return new Rectangle(new Point(0, 0), this._size);
	}

	get monsters(): Monster[] {
		return this._monsters;
	}

	get id(): number {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get planet(): Planet {
		return this._planet;
	}

	get size(): Size {
		return this._size;
	}

	get type(): ZoneType {
		return this._type;
	}

	get tileIDs(): Int16Array {
		return this._tileIDs;
	}

	get hotspots(): Hotspot[] {
		return this._hotspots;
	}

	get tileStore(): Tile[] {
		return this._tileStore;
	}

	get zoneStore(): Zone[] {
		return this._zoneStore;
	}

	get goalItems(): Tile[] {
		return this._goalItems;
	}

	get requiredItems(): Tile[] {
		return this._requiredItems;
	}

	get providedItems(): Tile[] {
		return this._providedItems;
	}

	get npcs(): Tile[] {
		return this._npcs;
	}

	get izx4Unknown(): number {
		return this._izx4Unknown;
	}

	get izaxUnknown(): number {
		return this._izaxUnknown;
	}

	get actions(): Action[] {
		return this._actions;
	}
}

declare namespace Zone {
	export type Layer = ZoneLayer;
	export type Type = ZoneType;
}

export default Zone;
