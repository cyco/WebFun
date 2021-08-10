import Hotspot from "./hotspot";
import { Point, PointLike, Rectangle, Size } from "src/util";
import ZoneType from "./zone-type";
import ZonePlanet from "./zone-planet";

import Action from "./action";
import ZoneLayer from "./zone-layer";
import Monster from "./monster";
import Tile from "./tile";
import AssetManager, { NullIfMissing } from "src/engine/asset-manager";
import { Zone as RawZone } from "src/engine/file-format/types";

const TILE_ADEGAN_CRYSTAL = 12;

class Zone {
	public static readonly LAYERS = 3;
	public static readonly Type = ZoneType;
	public static readonly Layer = ZoneLayer;
	public static readonly Planet = ZonePlanet;

	public id: number;
	public name: string;
	public planet: ZonePlanet;
	public size: Size;
	public type: ZoneType;
	public tileIDs: Int16Array;
	public hotspots: Hotspot[];
	public goalItems: Tile[];
	public requiredItems: Tile[];
	public providedItems: Tile[];
	public npcs: Tile[];
	public izx4Unknown: number;
	public izaxUnknown: number;
	public actions: Action[];
	public monsters: Monster[];

	public assets: AssetManager;

	// Runtime attributes
	public visited: boolean = false;
	public actionsInitialized: boolean = false;
	public counter: number = 0;
	public random: number = 0;
	public sectorCounter: number = 0;
	public doorInLocation: Point = new Point(0, 0);

	public constructor(id: number, data: Zone | RawZone, assets: AssetManager) {
		this.id = id;
		this.name = data.name;
		this.actions = data.actions.map((a, idx) => new Action(idx, this, a));
		this.monsters = data.monsters.map((m, idx) => new Monster(idx, m, assets));
		this.assets = assets;

		if (data instanceof Zone) {
			this.planet = data.planet;
			this.size = data.size;
			this.type = data.type;
			this.tileIDs = new Int16Array(data.tileIDs);
			this.hotspots = data.hotspots.map((htsp, idx) => new Hotspot(idx, htsp));
			this.goalItems = data.goalItems.slice();
			this.providedItems = data.providedItems.slice();
			this.requiredItems = data.requiredItems.slice();
			this.npcs = data.npcs.slice();
			this.izaxUnknown = data.izaxUnknown;
			this.izx4Unknown = data.izx4Unknown;
		} else {
			this.planet = Zone.Planet.fromNumber(data.planet);
			this.size = new Size(data.width, data.height);
			this.type = Zone.Type.fromNumber(data.zoneType);
			this.tileIDs = new Int16Array(data.tileIDs);
			this.hotspots = data.hotspots.map((htsp, idx) => new Hotspot(idx, htsp));
			this.goalItems = data.goalItemIDs.mapArray(id => assets.get(Tile, id));
			this.providedItems = data.providedItemIDs.mapArray(id => assets.get(Tile, id));
			this.requiredItems = data.requiredItemIDs.mapArray(id => assets.get(Tile, id));
			this.npcs = data.npcIDs.mapArray(id => assets.get(Tile, id));
			this.izaxUnknown = data.unknown;
			//this.izx4Unknown = data.unknown;
		}
	}

	get doors(): Hotspot[] {
		return this.hotspots.filter(
			hotspot => hotspot.type === Hotspot.Type.DoorIn && hotspot.arg !== -1
		);
	}

	getTileID(x: number, y: number, z: number): number {
		if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
			return null;
		}
		return this.tileIDs[Zone.LAYERS * (y * this.size.width + x) + z];
	}

	getTile(x: number | PointLike, y?: number, z?: number): Tile {
		({ x, y, z } = this.normalizeInput(x, y, z));

		if (!this.bounds.contains(new Point(x, y))) {
			//console.warn("Missing bounds check");
			//console.trace();
			return;
		}

		const index = this.getTileID(x, y, z);
		if (index === -1 || index === 0xffff) return null;

		return this.assets.get(Tile, index, NullIfMissing);
	}

	setTile(tile: Tile, x: number | PointLike, y?: number, z?: number): void {
		({ x, y, z } = this.normalizeInput(x, y, z));

		if (!this.bounds.contains(new Point(x, y))) {
			console.warn("Missing bounds check");
			console.trace();
			return;
		}

		const index = Zone.LAYERS * (y * this.size.width + x) + z;
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

		for (const hotspot of this.hotspots) {
			if (hotspot.type === Hotspot.Type.DoorIn && hotspot.arg !== -1) {
				const zone = assets.get(Zone, hotspot.arg, NullIfMissing);
				if (zone.leadsTo(needleZone, assets)) return true;
			}
		}

		return false;
	}

	public isLoadingZone(): boolean {
		return this.type === ZoneType.Load;
	}

	public initialize(): void {
		this.placeMonsters();
		this.layDownHotspotItems();
	}

	private placeMonsters(): void {
		this.monsters
			.filter(monster => monster.enabled)
			.forEach(monster => {
				if (this.getTile(monster.x, monster.y, ZoneLayer.Object) === null) {
					const tile = monster.face.frames[0].down;
					this.setTile(tile, monster.x, monster.y, ZoneLayer.Object);
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
						this.setTile({ id: hotspot.arg } as unknown as Tile, hotspot.x, hotspot.y, 1);
						break;
					case Hotspot.Type.DoorIn:
						if (hotspot.arg < 0) break;
						const zone = this.assets.get(Zone, hotspot.arg);
						zone.layDownHotspotItems();
						break;
					default:
						break;
				}
			});
	}

	public isRoom(): boolean {
		return this.size.width === 9;
	}

	get hasTeleporter(): boolean {
		return (
			this.type === ZoneType.Empty && this.hotspots.withType(Hotspot.Type.Teleporter).length !== 0
		);
	}

	public get bounds(): Rectangle {
		return new Rectangle(new Point(0, 0), this.size);
	}
}

declare namespace Zone {
	export type Layer = ZoneLayer;
	export type Type = ZoneType;
	export type Planet = ZonePlanet;
}

export default Zone;
