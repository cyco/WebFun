import { GameType, Indy, Yoda } from "../type";
import { Hotspot, Zone } from "src/engine/objects";

import AssetManager from "../asset-manager";
import { InputStream, Point } from "src/util";
import { MutableZone, MutableNPC } from "src/engine/mutable-objects";
import SaveState from "./save-state";
import World from "src/engine/world";
import Sector from "src/engine/sector";

interface Range {
	start: number;
	end: number;
}

abstract class Reader {
	protected _stream: InputStream;
	protected _assets: AssetManager;
	private _type: GameType;

	abstract read(assets: AssetManager): SaveState;

	constructor(stream: InputStream, type: GameType) {
		this._stream = stream;
		this._assets = null;
		this._type = type;
	}

	protected abstract _doRead(): SaveState;
	protected abstract readInt(stream: InputStream): number;
	protected abstract readSector(stram: InputStream, x: number, y: number): Sector;
	protected abstract readNPC(stream: InputStream): MutableNPC;
	protected abstract readHotspot(stream: InputStream, hottspot: Hotspot): Hotspot;

	protected readBool(stream: InputStream): boolean {
		return this.readInt(stream) !== 0;
	}

	protected readWorldDetails(stream: InputStream): void {
		do {
			const y = this.readInt(stream);
			const x = this.readInt(stream);

			if (x === -1 || y === -1) {
				break;
			}

			const zoneID = stream.getInt16();
			const visited = this.readBool(stream);

			this.readRoom(stream, zoneID, visited);
		} while (true);
	}

	protected readRooms(stream: InputStream, zoneID: number, start: number): void {
		const zoneIDs: [number, boolean][] = [];

		const zone = this._assets.get(Zone, zoneID);
		const hotspots = zone.hotspots;
		const count = hotspots.length;

		for (let i = start; i < count; i++) {
			start = i;
			let door;
			const hotspot = hotspots[i];
			if (Hotspot.Type.DoorIn === hotspot.type) {
				if (hotspot.arg === -1) {
					continue;
				}

				door = hotspot.arg;
			} else continue;

			const zoneID = stream.getInt16();
			const visited = this.readBool(stream);

			console.assert(
				!zoneID || zoneID === door,
				"Expected door to lead to zone {} instead of {}",
				zoneID,
				door
			);
			zoneIDs.push([door, visited]);
			break;
		}

		for (const [zoneID, visited] of zoneIDs) {
			this.readRoom(stream, zoneID, visited);
		}

		if (start + 1 < count) {
			this.readRooms(stream, zoneID, start + 1);
		}
	}

	protected readRoom(stream: InputStream, zoneID: number, visited: boolean): void {
		const zone: Zone = this._assets.get(Zone, zoneID);
		this.readZone(stream, zone, visited);
		this.readRooms(stream, zoneID, 0);
	}

	protected readZone(stream: InputStream, zone: MutableZone, visited: boolean) {
		if (visited) {
			zone.counter = this.readInt(stream);
			zone.random = this.readInt(stream);

			const x = this.readInt(stream);
			const y = this.readInt(stream);
			zone.doorInLocation = new Point(x, y);

			if (this._type === Yoda) {
				zone.sharedCounter = stream.getUint16();

				const planet = stream.getInt16();
				console.assert(planet === zone.planet.rawValue);
			}

			const tileCount = zone.size.width * zone.size.height * Zone.LAYERS;
			zone.tileIDs = stream.getInt16Array(tileCount);
		}

		zone.visited = this.readBool(stream);
		this.readHotspots(stream, zone);

		if (visited) {
			this.readNPCs(stream, zone);
			this.readActions(stream, zone);
		}
	}

	protected readHotspots(stream: InputStream, zone: MutableZone) {
		const count = this.readInt(stream);
		if (count < 0) return;
		if (count !== zone.hotspots.length) {
			zone.hotspots = Array.Repeat(new Hotspot(), count);
		}
		zone.hotspots = zone.hotspots.map(htsp => this.readHotspot(stream, htsp));
	}

	protected readNPCs(stream: InputStream, zone: MutableZone) {
		const count = this.readInt(stream);
		if (count < 0) return;

		if (this._type === Indy) zone.npcs = new Array(count);

		for (let i = 0; i < zone.npcs.length; i++) {
			const npc = this.readNPC(stream);
			npc.id = i;
			zone.npcs[i] = npc;
		}
	}

	protected readActions(stream: InputStream, zone: Zone): void {
		const count = this.readInt(stream);
		if (count < 0) return;

		for (const action of zone.actions) {
			action.enabled = this.readBool(stream);
		}

		for (let i = zone.actions.length; i < count; i++) {
			if (i === zone.actions.length) {
				console.log(`Zone ${zone.id} has additional actions`);
			}
			this.readInt(stream);
		}
	}

	protected readInventory(stream: InputStream): Int16Array {
		const count = this.readInt(stream);
		if (count < 0) return new Int16Array([]);
		const result = stream.getInt16Array(count);
		return result;
	}

	protected readWorld(stream: InputStream, xRange: Range, yRange: Range): World {
		const world = new World(this._assets);

		for (let y = yRange.start; y < yRange.end; y++) {
			for (let x = xRange.start; x < xRange.end; x++) {
				const item = this.readSector(stream, x, y);
				world.replaceSector(x, y, item);
			}
		}

		this.readWorldDetails(stream);

		return world;
	}

	protected readPuzzles(stream: InputStream): Int16Array {
		const count = stream.getUint16();
		return stream.getInt16Array(count);
	}
}

export default Reader;
