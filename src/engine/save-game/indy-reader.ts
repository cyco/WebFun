import { InputStream, Point } from "src/util";

import { Zone } from "src/engine/objects";
import { Indy } from "src/variant";
import Reader from "./reader";
import SaveState, { SavedHotspot, SavedMonster, SavedSector } from "./save-state";

class IndyReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Indy);
	}

	protected _doRead(): SaveState {
		const stream = this._stream;

		const seed = stream.readUint32() & 0xffff;

		const puzzleIDs1 = this.readPuzzles(stream);
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		const currentZoneID = stream.readUint16();
		const posXOnWorld = stream.readUint16();
		const posYOnWorld = stream.readUint16();

		// skip over unknown value
		stream.readUint16();
		const posXOnZone = stream.readUint16();
		const posYOnZone = stream.readUint16();
		// skip over unknown values
		stream.readInt16();
		stream.readInt16();
		stream.readInt16();
		stream.readInt16();

		stream.readInt16();
		stream.readInt16();
		stream.readInt16();

		const goalPuzzle = stream.readInt16();

		console.assert(
			stream.isAtEnd(),
			`Encountered ${stream.length - stream.offset} unknown bytes at end of stream`
		);

		const state = this._state;
		state.type = Indy;
		state.planet = Zone.Planet.None;
		state.seed = seed;
		state.puzzleIDs1 = puzzleIDs1;
		state.puzzleIDs2 = null;
		state.inventoryIDs = inventoryIDs;
		state.onDagobah = false;
		state.currentZoneID = currentZoneID;
		state.positionOnZone = new Point(posXOnZone, posYOnZone);
		state.positionOnWorld = new Point(posXOnWorld, posYOnWorld);
		state.goalPuzzle = goalPuzzle;
		state.world = world;

		state.damageTaken = 0;
		state.livesLost = 0;

		/*
		state.currentWeapon = current_weapon;
		state.currentAmmo = currentAmmo;
		state.blasterAmmo = blaster_ammo;
		state.blasterRifleAmmo = blaster_rifle_ammo;
		state.forceAmmo = force_ammo;
		state.dagobah = dagobah;
		state.timeElapsed = time_elapsed;
		state.difficulty = difficulty;
		state.unknownCount = unknown_count;
		state.unknownSum = unknown_sum;
		*/

		return state;
	}

	protected readSector(stream: InputStream, _x: number, _y: number): SavedSector {
		const visited = this.readBool(stream);
		const solved1 = this.readBool(stream);
		const solved2 = this.readBool(stream);

		const zoneID = stream.readInt16();
		const puzzleIndex = stream.readInt16();

		const requiredItemID = stream.readInt16();
		const findItemID = stream.readInt16();

		const npcID = stream.readInt16();
		// possibly zone or puzzle type, skip over it
		const type = Zone.Type.fromNumber(stream.readInt16());

		return {
			visited,
			solved1,
			solved2,
			puzzleIndex,
			zone: zoneID,
			requiredItem: requiredItemID,
			findItem: findItemID,
			npc: npcID,
			type
		};
	}

	protected readHotspot(stream: InputStream): SavedHotspot {
		const enabled = stream.readUint16() !== 0;
		const argument = stream.readInt16();

		return {
			enabled,
			argument
		};
	}

	protected readMonster(stream: InputStream): SavedMonster {
		const characterId = stream.readInt16();
		const x = stream.readInt16();
		const y = stream.readInt16();
		const damageTaken = stream.readInt16();

		stream.readUint8Array(0x18);

		return {
			face: characterId,
			position: new Point(x, y, Zone.Layer.Object),
			damageTaken: damageTaken
		};
	}

	protected readInt(stream: InputStream): number {
		return stream.readInt16();
	}
}

export default IndyReader;
