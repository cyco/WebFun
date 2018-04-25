import { Indy, Yoda, GameType } from "../type";
import { InputStream, Point } from "src/util";
import identify from "./identify";
import SaveState from "./save-state";
import GameData from "../game-data";
import { Action, Hotspot, HotspotType, NPC, Tile, Zone } from "src/engine/objects";
import { MutableHotspot, MutableNPC, MutableZone } from "src/engine/mutable-objects";
import { Planet, WorldSize } from "../types";
import World from "./world";
import WorldItem from "./world-item";

type MyRange = { start: number; end: number };

abstract class Reader {
	protected _stream: InputStream;
	protected _data: GameData;
	private _type: GameType;

	abstract read(gameData: GameData): SaveState;

	constructor(stream: InputStream, type: GameType) {
		this._stream = stream;
		this._data = null;
		this._type = type;
	}

	protected abstract _doRead(): SaveState;
	protected abstract readInt(stream: InputStream): number;
	protected abstract readWorldItem(stram: InputStream, x: number, y: number): WorldItem;
	protected abstract readNPC(stream: InputStream): void;
	protected abstract readHotspot(stream: InputStream, hottspot: Hotspot): Hotspot;

	protected readBool(stream: InputStream): boolean {
		return this.readInt(stream) != 0;
	}

	protected readWorldDetails(stream: InputStream): void {
		let x: number;
		let y: number;

		do {
			y = this.readInt(stream);
			x = this.readInt(stream);

			if (x == -1 || y == -1) {
				break;
			}

			let zoneID = stream.getInt16();
			let visited = this.readBool(stream);

			this.readRoom(stream, zoneID, visited);
		} while (true);
	}

	protected readRooms(stream: InputStream, zoneID: number, start: number): void {
		let count: number;
		let zoneIDs: [number, boolean][] = [];
		{
			let zone = this._data.zones[zoneID];
			let hotspots = zone.hotspots;
			count = hotspots.length;

			for (let i = start; i < count; i++) {
				start = i;
				let door;
				{
					let hotspot = hotspots[i];
					if (HotspotType.DoorIn === hotspot.type) {
						if (hotspot.arg === -1) {
							continue;
						}

						door = hotspot.arg;
					} else {
						continue;
					}
				}

				let zoneID = stream.getInt16();
				let visited = this.readBool(stream);

				console.assert(
					zoneID == door,
					"Expected door to lead to zone {} instead of {}",
					zoneID,
					door
				);
				zoneIDs.push([door, visited]);
				break;
			}
		}

		for (const [zoneID, visited] of zoneIDs) {
			this.readRoom(stream, zoneID, visited);
		}

		if (start + 1 < count) {
			this.readRooms(stream, zoneID, start + 1);
		}
	}

	protected readRoom(stream: InputStream, zoneID: number, visited: boolean): void {
		let zone: Zone = this._data.zones[zoneID];
		this.readZone(stream, zone, visited);
		this.readRooms(stream, zoneID, 0);
	}

	protected readZone(stream: InputStream, zone: MutableZone, visited: boolean) {
		if (visited) {
			let counter = this.readInt(stream);
			let random = this.readInt(stream);
			let doorInX = this.readInt(stream);
			let doorInY = this.readInt(stream);

			if (this._type == Yoda) {
				let padding = stream.getUint16();
				let planet = stream.getInt16();
			}

			let tile_count = zone.size.width * zone.size.height * Zone.LAYERS;
			zone.tileIDs = stream.getInt16Array(tile_count);
		}

		let __visited = this.readBool(stream);
		this.readHotspots(stream, zone);

		if (visited) {
			this.readNPCs(stream, zone);
			this.readActions(stream, zone);
		}
	}

	protected readHotspots(stream: InputStream, zone: MutableZone) {
		let count = this.readInt(stream);
		if (count < 0) return;
		if (count !== zone.hotspots.length) {
			console.warn(`change hotspots from ${zone.hotspots.length} to ${count}`);
			zone.hotspots = Array.Repeat(new Hotspot(), count);
		}
		zone.hotspots = zone.hotspots.map(htsp => this.readHotspot(stream, htsp));
	}

	protected readNPCs(stream: InputStream, zone: MutableZone) {
		let count = this.readInt(stream);
		if (count < 0) return;

		if (this._type === Indy) zone.npcs = new Array(count);

		console.assert(
			count === zone.npcs.length,
			`Number of npcs can't be change from ${zone.npcs.length} to ${count}`
		);

		for (const npc of zone.npcs) {
			this.readNPC(stream);
		}
	}

	protected readActions(stream: InputStream, zone: Zone): void {
		let count = this.readInt(stream);
		if (count < 0) return;
		console.assert(
			count === zone.actions.length,
			`Number of actions can't be change from ${zone.actions.length} to ${count}`
		);

		for (const action of zone.actions) {
			action.enabled = this.readBool(stream);
		}
	}

	protected readInventory(stream: InputStream): Int16Array {
		let count = this.readInt(stream);
		if (count < 0) return new Int16Array([]);
		const result = stream.getInt16Array(count);
		return result;
	}

	protected readWorld(stream: InputStream, xRange: MyRange, yRange: MyRange): World {
		const world = new World();

		for (let y = yRange.start; y < yRange.end; y++) {
			for (let x = xRange.start; x < xRange.end; x++) {
				const item = this.readWorldItem(stream, x, y);
				world.setWorldItem(x, y, item);
			}
		}
		this.readWorldDetails(stream);
		return world;
	}

	protected readPuzzles(stream: InputStream): Int16Array {
		let count = stream.getUint16();
		return stream.getInt16Array(count);
	}
}

export default Reader;
