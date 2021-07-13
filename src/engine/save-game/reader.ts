import Variant from "../variant";
import { Indy, Yoda, YodaDemo, IndyDemo } from "src/variant";
import { Hotspot, Zone } from "src/engine/objects";

import AssetManager from "../asset-manager";
import { InputStream, Point } from "src/util";
import SaveState, {
	SavedHotspot,
	SavedMonster,
	SavedSector,
	SavedWorld,
	SavedZone
} from "./save-state";

interface Range {
	start: number;
	end: number;
}

abstract class Reader {
	protected _stream: InputStream;
	protected _assets: AssetManager;
	protected _type: Variant;
	protected _zones: Map<number, SavedZone>;

	abstract read(assets: AssetManager): SaveState;

	constructor(stream: InputStream, type: Variant) {
		this._stream = stream;
		this._assets = null;
		this._type = type;
		this._zones = new Map();
	}

	protected abstract _doRead(): SaveState;
	protected abstract readInt(stream: InputStream): number;
	protected abstract readSector(stream: InputStream, x: number, y: number): SavedSector;
	protected abstract readMonster(stream: InputStream): SavedMonster;
	protected abstract readHotspot(stream: InputStream): SavedHotspot;

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

			const zoneID = stream.readInt16();
			const visited = this.readBool(stream);

			this.readRoom(stream, zoneID, visited);
		} while (true);
	}

	protected readRooms(stream: InputStream, zoneID: number, start: number): void {
		const zoneIDs: [number, boolean][] = [];

		const assetHotspots = this._assets.get(Zone, zoneID).hotspots;
		const hotspots = this._zones.get(zoneID).hotspots;
		const count = hotspots.length;

		for (let i = start; i < count; i++) {
			start = i;
			let door;
			const hotspot = hotspots[i];
			const type = assetHotspots[i]?.type.rawValue ?? hotspot.type;

			if (Hotspot.Type.DoorIn.rawValue === type) {
				if (hotspot.argument === -1) {
					continue;
				}

				door = hotspot.argument;
			} else continue;

			const zoneID = stream.readInt16();
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
		this.readZone(stream, zoneID, visited);
		this.readRooms(stream, zoneID, 0);
	}

	protected readZone(stream: InputStream, id: number, visited: boolean): void {
		const assetZone: Zone = this._assets.get(Zone, id);
		let zone = this._zones.get(id);
		if (!zone) {
			zone = {
				id,
				visited: false,
				counter: -1,
				sectorCounter: -1,
				random: -1,
				hotspots: [],
				monsters: [],
				actions: [],
				doorInLocation: null,
				tileIDs: null
			};
			this._zones.set(id, zone);
		}

		if (visited) {
			zone.counter = this.readInt(stream);
			zone.random = this.readInt(stream);

			const x = this.readInt(stream);
			const y = this.readInt(stream);
			zone.doorInLocation = new Point(x, y);

			if (this._type === Yoda || this._type === YodaDemo) {
				zone.sectorCounter = stream.readInt16();

				const planet = stream.readInt16();
				console.assert(planet === assetZone.planet.rawValue);
			}

			const tileCount = assetZone.size.width * assetZone.size.height * Zone.LAYERS;
			zone.tileIDs = stream.readInt16Array(tileCount);
		}

		zone.visited = this.readBool(stream) || visited;
		this.readHotspots(stream, zone.id);

		if (visited) {
			this.readMonsters(stream, zone.id);
			this.readActions(stream, zone.id);
		}
	}

	protected readHotspots(stream: InputStream, zoneID: number): void {
		const zone = this._zones.get(zoneID);
		const count = this.readInt(stream);
		console.assert(count >= 0);
		zone.hotspots = count.times(_ => this.readHotspot(stream));
	}

	protected readMonsters(stream: InputStream, zoneID: number): void {
		const zone = this._zones.get(zoneID);
		const count = this.readInt(stream);
		console.assert(count >= 0);
		zone.monsters = count.times(_ => this.readMonster(stream));
	}

	protected readActions(stream: InputStream, zoneID: number): void {
		const zone = this._zones.get(zoneID);
		const count = this.readInt(stream);
		console.assert(count >= 0);

		zone.actions = count.times(() => !this.readBool(stream));

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
		const result = stream.readInt16Array(count);
		return result;
	}

	protected readWorld(stream: InputStream, xRange: Range, yRange: Range): SavedWorld {
		const world: SavedWorld = { sectors: new Array(10 * 10) };

		for (let y = yRange.start; y < yRange.end; y++) {
			for (let x = xRange.start; x < xRange.end; x++) {
				const item = this.readSector(stream, x, y);
				world.sectors[y * 10 + x] = item;
			}
		}

		this.readWorldDetails(stream);

		return world;
	}

	protected readPuzzles(stream: InputStream): Int16Array {
		const count = stream.readUint16();
		return stream.readInt16Array(count);
	}
}

export default Reader;
