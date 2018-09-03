import { Action, Hotspot, HotspotType, NPC, Zone, Tile } from "src/engine/objects";
import { OutputStream } from "src/util";
import GameData from "../game-data";
import SaveState from "./save-state";
import World from "./world";
import WorldItem from "./world-item";

class Writer {
	_data: GameData;

	constructor(data: GameData) {
		this._data = data;
	}

	write(state: SaveState, stream: OutputStream): void {
		stream.writeCharacters("YODASAV44");
		stream.writeUint32(state.seed);
		stream.writeUint32(state.planet.rawValue);

		stream.writeUint32(+state.onDagobah);

		stream.writeUint16(state.puzzleIDs1.length);
		stream.writeUint16Array(state.puzzleIDs1);

		stream.writeUint16(state.puzzleIDs2.length);
		stream.writeUint16Array(state.puzzleIDs2);

		this._writeDagobah(state.dagobah, stream);
		this._writeWorld(state.world, stream);

		stream.writeInt32(state.inventoryIDs.length);
		stream.writeInt16Array(state.inventoryIDs);

		stream.writeInt16(state.currentZoneID);

		stream.writeUint32(state.positionOnWorld.x);
		stream.writeUint32(state.positionOnWorld.y);

		stream.writeInt16(state.currentWeapon);
		if (state.currentWeapon !== -1) {
			stream.writeInt16(state.currentAmmo);
		}

		stream.writeInt16(state.forceAmmo);
		stream.writeInt16(state.blasterAmmo);
		stream.writeInt16(state.blasterRifleAmmo);

		stream.writeUint32(state.positionOnZone.x * Tile.WIDTH);
		stream.writeUint32(state.positionOnZone.y * Tile.HEIGHT);

		stream.writeUint32(state.damageTaken);
		stream.writeUint32(state.livesLost);

		stream.writeUint32(state.difficulty);
		stream.writeUint32(state.timeElapsed);

		stream.writeInt32(state.worldSize.rawValue - 1);

		stream.writeInt16(state.unknownCount);
		stream.writeInt16(state.unknownSum);

		stream.writeUint32(state.goalPuzzle);
		stream.writeUint32(state.goalPuzzle);
	}

	_writeDagobah(world: World, stream: OutputStream): void {
		for (let y = 4; y <= 5; y++) {
			for (let x = 4; x <= 5; x++) {
				this._writeWorldItem(world.getWorldItem(x, y), stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	_writeWorld(world: World, stream: OutputStream): void {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				this._writeWorldItem(world.getWorldItem(x, y), stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	_writeRoom(zone: Zone, visited: boolean, stream: OutputStream): void {
		this._writeZone(zone, visited, stream);
		const doors = zone.hotspots.filter(
			(hotspot: Hotspot) => hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1
		);
		doors.forEach((hotspot: Hotspot) => {
			const zone = this._data.zones[hotspot.arg];
			stream.writeInt16(zone.id);
			stream.writeUint32(zone.visited ? 1 : 0);
			this._writeRoom(zone, visited, stream);
		});
	}

	_writeZone(zone: Zone, visited: boolean, stream: OutputStream): void {
		console.log("write zone", zone.id, visited ? "full" : "minimal");
		if (visited) {
			stream.writeUint32(zone.counter);
			stream.writeUint32(zone.random);
			stream.writeInt32(zone.doorInLocation.x);
			stream.writeInt32(zone.doorInLocation.y);
			stream.writeUint16(zone.padding);
			stream.writeUint16(zone.planet.rawValue);

			stream.writeInt16Array(zone.tileIDs);
		}

		stream.writeUint32(+zone.visited);

		stream.writeUint32(zone.hotspots.length);
		zone.hotspots.forEach((hotspot: Hotspot) => this._writeHotspot(hotspot, stream));

		if (visited) {
			stream.writeUint32(zone.npcs.length);
			zone.npcs.forEach((npc: NPC) => this._writeNPC(npc, stream));

			stream.writeUint32(zone.actions.length);
			zone.actions.forEach((action: Action) => stream.writeUint32(+action.enabled));
		}
	}

	_writeNPC(npc: NPC, stream: OutputStream): void {
		stream.writeInt16(npc.face.id);
		stream.writeInt16(npc.position.x);
		stream.writeInt16(npc.position.y);
		stream.writeInt16(0); // TODO: field_A
		stream.writeUint32(+npc.enabled);
		stream.writeInt16(0); // TODO: field_10
		stream.writeInt16(0); // TODO: y__
		stream.writeInt16(0); // TODO: x__
		stream.writeInt16(0); // TODO: current_frame
		stream.writeUint32(0); // field_18
		stream.writeUint32(0); // field_1C
		stream.writeUint32(0); // field_20
		stream.writeInt16(0); // TODO: x_
		stream.writeInt16(0); // TODO: y_
		stream.writeInt16(0); // TODO: field_3C
		stream.writeInt16(0); // TODO: field_3E
		stream.writeInt16(0); // TODO: field_60
		stream.writeInt16(0); // TODO: field_26

		stream.writeUint32(0); // TODO: field_2C
		stream.writeUint32(0); // TODO: field_34
		stream.writeUint32(0); // TODO: field_28
		stream.writeInt16(0); // TODO: field_24
		stream.writeInt16(0);

		for (let i = 0; i < 4; i++) {
			stream.writeInt32(0); // TODO;
		}
	}

	_writeHotspot(hotspot: Hotspot, stream: OutputStream): void {
		stream.writeUint16(+hotspot.enabled);
		stream.writeInt16(hotspot.arg);
		stream.writeUint32(hotspot.type.rawValue);
		stream.writeInt16(hotspot._x);
		stream.writeInt16(hotspot._y);
	}

	_writeWorldDetails(world: World, stream: OutputStream): void {
		for (let y = 0; y < world.size.height; y++) {
			for (let x = 0; x < world.size.width; x++) {
				const item = world.getWorldItem(x, y);
				if (!item || item.zoneId === -1 || item.zoneId === undefined) continue;

				stream.writeInt32(x);
				stream.writeInt32(y);

				stream.writeInt16(item.zoneId);
				stream.writeUint32(+item.visited);

				this._writeRoom(this._data.zones[item.zoneId], item.visited, stream);
			}
		}

		stream.writeInt32(-1);
		stream.writeInt32(-1);
	}

	_writeWorldItem(item: WorldItem, stream: OutputStream): void {
		stream.writeUint32(+item.visited);

		stream.writeUint32(item.solved_1);
		stream.writeUint32(item.solved_3);
		stream.writeUint32(item.solved_2);
		stream.writeUint32(item.solved_4);

		stream.writeInt16(item.zoneId);
		stream.writeInt16(item.field_C);
		stream.writeInt16(item.required_item_id);
		stream.writeInt16(item.find_item_id);
		stream.writeInt16(item.field_Ea);
		stream.writeInt16(item.additionalRequiredItem);
		stream.writeInt16(item.field_16);
		stream.writeInt16(item.npc_id);

		// TODO: fix unknown values
		stream.writeInt32(item.zoneType);
		stream.writeInt16(0);
	}
}

export default Writer;
