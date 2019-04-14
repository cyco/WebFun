import { InputStream, Point } from "src/util";

import GameData from "../game-data";
import { Hotspot } from "src/engine/objects";
import { Indy } from "src/engine/type";
import { MutableHotspot } from "src/engine/mutable-objects";
import { Planet } from "../types";
import Reader from "./reader";
import SaveState from "./save-state";
import WorldItem from "./world-item";

class IndyReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Indy);
	}

	public read(gameData: GameData): SaveState {
		this._data = gameData;
		return this._doRead();
	}

	protected _doRead(): SaveState {
		const stream = this._stream;

		const seed = stream.getUint32() & 0xffff;

		const puzzleIDs1 = this.readPuzzles(stream);
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		const currentZoneID = stream.getUint16();
		const posXOnWorld = stream.getUint16();
		const posYOnWorld = stream.getUint16();

		// skip over unknown value
		stream.getUint16();
		const posXOnZone = stream.getUint16();
		const posYOnZone = stream.getUint16();
		// skip over unknown values
		stream.getInt16();
		stream.getInt16();
		stream.getInt16();
		stream.getInt16();

		stream.getInt16();
		stream.getInt16();
		stream.getInt16();

		const goalPuzzle = stream.getInt16();

		console.assert(
			stream.isAtEnd(),
			`Encountered ${stream.length - stream.offset} unknown bytes at end of stream`
		);

		const state = new SaveState();
		state.type = Indy;
		state.planet = Planet.NONE;
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

	protected readWorldItem(stream: InputStream, _x: number, _y: number): WorldItem {
		const visited = this.readBool(stream);
		const solved_1 = this.readBool(stream);
		const solved_2 = this.readBool(stream);

		const zoneID = stream.getInt16();
		const field_C = stream.getInt16();

		const requiredItemID = stream.getInt16();
		const findItemID = stream.getInt16();

		const npcID = stream.getInt16();
		// possibly zone or puzzle type, skip over it
		stream.getInt16();

		const worldItem = new WorldItem();
		worldItem.visited = visited;
		worldItem.solved_1 = solved_1 ? 1 : 0;
		worldItem.solved_2 = solved_2 ? 1 : 0;
		// worldItem.solved_3 = solved_3 ? 1 : 0;
		// worldItem.solved_4 = solved_4 ? 1 : 0;
		worldItem.zoneId = zoneID;
		worldItem.field_C = field_C;
		worldItem.required_item_id = requiredItemID;
		worldItem.find_item_id = findItemID;
		// worldItem.field_Ea = field_ea;
		// worldItem.additionalRequiredItem = additionalRequiredItem;
		// worldItem.field_16 = field_16;
		worldItem.npc_id = npcID;
		return worldItem;
	}

	protected readHotspot(stream: InputStream, oldHotspot: Hotspot): Hotspot {
		const enabled = stream.getUint16() !== 0;
		const argument = stream.getInt16();

		const hotspot = new MutableHotspot();
		hotspot.enabled = enabled;
		hotspot.type = oldHotspot.type;
		hotspot.arg = argument;
		hotspot.x = oldHotspot.x;
		hotspot.y = oldHotspot.y;
		return hotspot;
	}

	protected readNPC(stream: InputStream): void {
		stream.getUint8Array(0x20);
	}

	protected readInt(stream: InputStream): number {
		return stream.getInt16();
	}
}

export default IndyReader;
