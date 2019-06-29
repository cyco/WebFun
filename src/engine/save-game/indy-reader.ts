import { InputStream, Point } from "src/util";

import { Hotspot, Char } from "src/engine/objects";
import { Indy } from "src/engine/type";
import { MutableHotspot, MutableNPC } from "src/engine/mutable-objects";
import { Planet } from "../types";
import Reader from "./reader";
import SaveState from "./save-state";
import WorldItem from "./world-item";
import AssetManager, { NullIfMissing } from "../asset-manager";

class IndyReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Indy);
	}

	public read(assets: AssetManager): SaveState {
		this._assets = assets;
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
		const solved1 = this.readBool(stream);
		const solved2 = this.readBool(stream);

		const zoneID = stream.getInt16();
		const fieldC = stream.getInt16();

		const requiredItemID = stream.getInt16();
		const findItemID = stream.getInt16();

		const npcID = stream.getInt16();
		// possibly zone or puzzle type, skip over it
		stream.getInt16();

		const worldItem = new WorldItem();
		worldItem.visited = visited;
		worldItem.solved1 = solved1 ? 1 : 0;
		worldItem.solved2 = solved2 ? 1 : 0;
		// worldItem.solved3 = solved3 ? 1 : 0;
		// worldItem.solved4 = solved4 ? 1 : 0;
		worldItem.zoneId = zoneID;
		worldItem.fieldC = fieldC;
		worldItem.requiredItemId = requiredItemID;
		worldItem.findItemID = findItemID;
		// worldItem.fieldEA = fieldEA;
		// worldItem.additionalRequiredItem = additionalRequiredItem;
		// worldItem.field16 = field16;
		worldItem.npcID = npcID;
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

	protected readNPC(stream: InputStream): MutableNPC {
		const characterId = stream.getInt16();
		const x = stream.getInt16();
		const y = stream.getInt16();
		const damageTaken = stream.getInt16();

		stream.getUint8Array(0x18);

		const npc = new MutableNPC();
		npc.face = this._assets.get(Char, characterId, NullIfMissing);
		npc.position = new Point(x, y);
		npc.damageTaken = damageTaken;

		return npc;
	}

	protected readInt(stream: InputStream): number {
		return stream.getInt16();
	}
}

export default IndyReader;
