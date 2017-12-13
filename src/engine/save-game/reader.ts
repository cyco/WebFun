import { InputStream, Point } from "../../util";
import GameData from "../game-data";
import { Action, Hotspot, HotspotType, NPC, Tile, Zone } from "../objects";
import { Planet, WorldSize } from "../types";
import SaveState from "./save-state";
import World from "./world";
import WorldItem from "./world-item";
import { MutableZone } from "src/engine/mutable-objects";
import MutableNPC from "src/engine/mutable-objects/mutable-npc";

class Reader {
	_data: GameData;

	constructor(data: GameData) {
		this._data = data;
	}

	read(stream: InputStream): SaveState {
		const state = new SaveState();
		const magic = stream.getCharacters(9);
		console.assert(magic === "YODASAV44");

		state.seed = stream.getUint32();
		state.planet = Planet.fromNumber(stream.getUint32());

		state.onDagobah = !!stream.getUint32();

		const puzzles1Count = stream.getUint16();
		state.puzzleIDs1 = stream.getInt16Array(puzzles1Count);

		const puzzles2Count = stream.getUint16();
		state.puzzleIDs2 = stream.getInt16Array(puzzles2Count);

		state.dagobah = this._readDagobah(stream);
		state.world = this._readWorld(stream);

		const inventoryCount = stream.getInt16();
		const inventoryIDs = stream.getUint32Array(inventoryCount);
		state.inventoryIDs = new Int16Array(inventoryIDs);

		state.currentZoneID = stream.getInt16();

		const positionOnWorld = new Point(0, 0);
		positionOnWorld.x = stream.getUint32();
		positionOnWorld.y = stream.getUint32();
		state.positionOnWorld = positionOnWorld;

		state.currentWeapon = stream.getInt16();
		state.currentAmmo = -1;
		if (state.currentWeapon !== -1)
			state.currentAmmo = stream.getInt16();
		state.forceAmmo = stream.getInt16();
		state.blasterAmmo = stream.getInt16();
		state.blasterRifleAmmo = stream.getInt16();

		const positionOnZone = new Point(0, 0);
		positionOnZone.x = stream.getUint32() / Tile.WIDTH;
		positionOnZone.y = stream.getUint32() / Tile.HEIGHT;
		state.positionOnZone = positionOnZone;

		state.damageTaken = stream.getUint32();
		state.livesLeft = stream.getUint32();

		state.difficulty = stream.getUint32();
		state.timeElapsed = stream.getUint32();
		state.worldSize = WorldSize.fromNumber(stream.getInt16());
		state.unknownCount = stream.getInt16();
		state.unknownSum = stream.getInt16();
		state.unknownThing = stream.getInt16();

		state.goalPuzzle = stream.getUint32();
		const goalPuzzleAgain = stream.getUint32();
		console.assert(state.goalPuzzle === goalPuzzleAgain, "Puzzle ID must be the same!");
		return state;
	}

	_readDagobah(stream: InputStream): World {
		const world = new World();
		for (let y = 4; y <= 5; y++) {
			for (let x = 4; x <= 5; x++) {
				world.setWorldItem(x, y, this._readWorldItem(stream));
			}
		}

		this._readWorldDetails(stream);
		return world;
	}

	_readWorld(stream: InputStream): World {
		const world = new World();
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				world.setWorldItem(x, y, this._readWorldItem(stream));
			}
		}

		this._readWorldDetails(stream);
		return world;
	}

	_readRoom(zoneId: number, visited: boolean, stream: InputStream): void {
		const zone = this._data.zones[zoneId];
		this._readZone(zone, visited, stream);
		const doors = zone.hotspots.withType(HotspotType.DoorIn).filter((hotspot: Hotspot) => hotspot.arg !== -1);
		doors.forEach((hotspot: Hotspot) => {
			const zoneId = stream.getInt16();
			const visited = !!stream.getUint32();
			console.assert(hotspot.arg === zoneId, "Zone IDs should be equal");
			this._readRoom(zoneId, visited, stream);
		});
	}

	_readZone(zone: MutableZone, visited: boolean, stream: InputStream): void {
		if (visited) {
			zone.counter = stream.getUint32();
			zone.random = stream.getUint32();
			stream.getUint32(); // field_83C
			stream.getUint32(); // field_840
			zone.padding = stream.getUint16();
			zone.planet = Planet.fromNumber(stream.getUint16());

			zone.tileIDs = stream.getInt16Array(zone.size.area * Zone.LAYERS);
		}

		zone.visited = !!stream.getUint32();

		const hotspotCount = stream.getUint32();
		console.assert(hotspotCount === zone.hotspots.length, "Hotspot counts must be equal!");
		zone.hotspots.forEach((hotspot: Hotspot) => this._readHotspot(hotspot, stream));

		if (visited) {
			const npcCount = stream.getUint32();
			console.assert(npcCount === zone.npcs.length, "NPC counts must be equal!");
			zone.npcs.forEach((npc: NPC) => this._readNPC(<MutableNPC>npc, stream));

			const actionCount = stream.getUint32();
			console.assert(actionCount === zone.actions.length, "Action counts must be equal!");
			zone.actions.forEach((action: Action) => action.enabled = !!stream.getUint32());
		}
	}

	_readNPC(npc: MutableNPC, stream: InputStream): void {
		const characterId = stream.getInt16();
		npc.character = this._data.characters[characterId];
		const x = stream.getInt16();
		const y = stream.getInt16();
		npc.position = new Point(x, y);
		stream.getInt16(); // field_A
		npc.enabled = !!stream.getUint32();
		stream.getInt16(); // field_10
		stream.getInt16(); // y__
		stream.getInt16(); // x__
		stream.getInt16(); // current_frame
		stream.getUint32(); // field_18
		stream.getUint32();// field_1C
		stream.getUint32();// field_20
		stream.getInt16(); // x_
		stream.getInt16(); // y_
		stream.getInt16();// field_3C
		stream.getInt16();// field_3E
		stream.getInt16();// field_60
		stream.getInt16();// field_26

		stream.getUint32(); // field_2C
		stream.getUint32(); // field_34
		stream.getUint32(); // field_28
		stream.getInt16();// field_24
		stream.getInt16();

		for (let i = 0; i < 4; i++)
			stream.getUint32();
	}

	_readHotspot(hotspot: Hotspot, stream: InputStream): void {
		hotspot.enabled = !!stream.getUint16();
		hotspot.arg = stream.getInt16();
		hotspot.type = HotspotType.fromNumber(stream.getUint32());
		hotspot._x = stream.getInt16();
		hotspot._y = stream.getInt16();
	}

	_readWorldDetails(stream: InputStream): void {
		let x: number, y: number;
		do {
			x = stream.getInt32();
			y = stream.getInt32();
			if (x !== -1 || y !== -1) {
				const zoneId = stream.getInt16();
				const visited = !!stream.getUint32();

				this._readRoom(zoneId, visited, stream);
			}
		} while (x !== -1 && y !== -1);
	}

	_readWorldItem(stream: InputStream): WorldItem {
		const item = new WorldItem();

		item.visited = !!stream.getUint32();
		item.solved_1 = stream.getUint32();
		item.solved_3 = stream.getUint32();
		item.solved_2 = stream.getUint32();
		item.solved_4 = stream.getUint32();
		item.zoneId = stream.getInt16();
		item.field_C = stream.getInt16();
		item.required_item_id = stream.getInt16();
		item.find_item_id = stream.getInt16();
		item.field_Ea = stream.getInt16();
		item.additionalRequiredItem = stream.getInt16();
		item.field_16 = stream.getInt16();
		item.npc_id = stream.getInt16();

		stream.getInt32(); // unknown
		stream.getInt16(); // unknown

		return item;
	}
}

export default Reader;
