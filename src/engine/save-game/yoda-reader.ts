import { Hotspot, HotspotType, Tile } from "src/engine/objects";
import { InputStream, Point } from "src/util";
import { MutableHotspot, MutableNPC } from "src/engine/mutable-objects";
import { Planet, WorldSize } from "../types";

import GameData from "../game-data";
import Reader from "./reader";
import SaveState from "./save-state";
import WorldItem from "./world-item";
import { Yoda } from "../type";
import { floor } from "src/std/math";

class YodaReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Yoda);
	}

	public read(gameData: GameData): SaveState {
		this._data = gameData;
		return this._doRead();
	}

	protected _doRead(): SaveState {
		const stream = this._stream;

		let seed = stream.getUint32() & 0xffff;

		let planet = stream.getUint32();
		let on_dagobah = stream.getUint32() != 0;

		const puzzleIDs1 = this.readPuzzles(stream);
		const puzzleIDs2 = this.readPuzzles(stream);
		const dagobah = this.readWorld(stream, { start: 4, end: 6 }, { start: 4, end: 6 });
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		let currentZoneID = stream.getUint16();
		let posXOnWorld = stream.getUint32();
		let posYOnWorld = stream.getUint32();

		let currentWeapon = stream.getInt16();
		let currentAmmo = currentWeapon >= 0 ? stream.getInt16() : -1;

		let forceAmmo = stream.getInt16();
		let blasterAmmo = stream.getInt16();
		let blasterRifleAmmo = stream.getInt16();

		let posXOnZone = floor(stream.getUint32() / Tile.WIDTH);
		let posYOnZone = floor(stream.getUint32() / Tile.HEIGHT);

		let damageTaken = stream.getInt32();
		let livesLost = stream.getInt32();

		let difficulty = stream.getUint32();
		let time_elapsed = stream.getUint32();

		let world_size = stream.getInt32();
		let unknown_count = stream.getInt16();
		let unknown_sum = stream.getInt16();

		let goalPuzzle = stream.getUint32();
		let goalPuzzleAgain = stream.getUint32();

		console.assert(
			goalPuzzle === goalPuzzleAgain,
			`Expected goal ${goalPuzzle} to be reapeted. Found ${goalPuzzleAgain} instead`
		);
		console.assert(
			stream.isAtEnd(),
			`Encountered ${stream.length - stream.offset} unknown bytes at end of stream`
		);

		const state = new SaveState();
		state.type = Yoda;
		state.planet = Planet.fromNumber(planet);
		state.seed = seed;
		state.puzzleIDs1 = puzzleIDs1;
		state.puzzleIDs2 = puzzleIDs2;
		state.inventoryIDs = inventoryIDs;
		state.onDagobah = on_dagobah;
		state.currentZoneID = currentZoneID;
		state.positionOnZone = new Point(posXOnZone, posYOnZone);
		state.positionOnWorld = new Point(posXOnWorld, posYOnWorld);
		state.goalPuzzle = goalPuzzle;
		state.currentWeapon = currentWeapon;
		state.currentAmmo = currentAmmo;
		state.blasterAmmo = blasterAmmo;
		state.blasterRifleAmmo = blasterRifleAmmo;
		state.forceAmmo = forceAmmo;
		state.damageTaken = damageTaken;
		state.livesLost = livesLost;
		state.dagobah = dagobah;
		state.world = world;
		state.timeElapsed = time_elapsed;
		state.difficulty = difficulty;
		state.unknownCount = unknown_count;
		state.unknownSum = unknown_sum;
		try {
			state.worldSize = WorldSize.fromNumber(1 + world_size);
		} catch (_) {
			state.worldSize = WorldSize.Small;
		}
		return state;
	}

	protected readWorldItem(stream: InputStream, _x: number, _y: number): WorldItem {
		let visited = this.readBool(stream);
		let solved_1 = this.readBool(stream);
		let solved_2 = this.readBool(stream);

		let solved_3 = stream.getUint32() != 0;
		let solved_4 = stream.getUint32() != 0;

		let zoneId = stream.getInt16();
		let field_c = stream.getInt16();
		let required_item_id = stream.getInt16();
		let find_item_id = stream.getInt16();
		let field_ea = stream.getInt16();
		let additionalRequiredItem = stream.getInt16();
		let field_16 = stream.getInt16();
		let npc_id = stream.getInt16();

		let zoneType = stream.getInt32();
		// skip over unknown value
		stream.getInt16();

		const worldItem = new WorldItem();
		worldItem.visited = visited;
		worldItem.solved_1 = solved_1 ? 1 : 0;
		worldItem.solved_2 = solved_2 ? 1 : 0;
		worldItem.solved_3 = solved_3 ? 1 : 0;
		worldItem.solved_4 = solved_4 ? 1 : 0;
		worldItem.zoneId = zoneId;
		worldItem.field_C = field_c;
		worldItem.required_item_id = required_item_id;
		worldItem.find_item_id = find_item_id;
		worldItem.field_Ea = field_ea;
		worldItem.additionalRequiredItem = additionalRequiredItem;
		worldItem.field_16 = field_16;
		worldItem.npc_id = npc_id;
		worldItem.zoneType = zoneType;

		return worldItem;
	}

	protected readNPC(stream: InputStream): void {
		// skip over char id
		stream.getInt16();
		let x = stream.getInt16();
		let y = stream.getInt16();
		// skip over unknown value (field_a)
		stream.getInt16();
		let enabled = stream.getUint32() != 0;
		// skip over unknown value (field_10)
		stream.getInt16();

		// skip over unknown value (field_x__)
		stream.getInt16();
		// skip over unknown value (field_y__)
		stream.getInt16();
		// skip over current frame
		stream.getInt16();
		// skip over unknown value (field_18)
		stream.getUint32();
		// skip over unknown value (field_1c)
		stream.getUint32();
		// skip over unknown value (field_2)
		stream.getUint32();
		// skip over unknown value (field_x_)
		stream.getInt16();
		// skip over unknown value (field_y_)
		stream.getInt16();
		// skip over unknown value (field_3c)
		stream.getInt16();
		// skip over unknown value (field_3e)
		stream.getInt16();
		// skip over unknown value (field_60)
		stream.getInt16();
		// skip over unknown value (field_26)
		stream.getInt16();
		// skip over unknown value (field_2c)
		stream.getUint32();
		// skip over unknown value (field_34)
		stream.getUint32();
		// skip over unknown value (field_28)
		stream.getUint32();

		// skip over unknown value (field_24)
		stream.getInt16();
		// skip over unknown value (
		stream.getInt16();

		for (let i = 0; i < 4; i++) {
			stream.getUint32();
			stream.getUint32();
		}

		const npc = new MutableNPC();
		npc.enabled = enabled;
		npc.position = new Point(x, y);
	}

	protected readHotspot(stream: InputStream, _: Hotspot): Hotspot {
		let enabled = stream.getUint16() != 0;
		let argument = stream.getInt16();
		let type = HotspotType.fromNumber(stream.getUint32());
		let x = stream.getInt16();
		let y = stream.getInt16();

		const hotspot = new MutableHotspot();
		hotspot.enabled = enabled;
		hotspot.type = type;
		hotspot.arg = argument;
		hotspot.x = x;
		hotspot.y = y;

		return hotspot;
	}

	protected readInt(stream: InputStream): number {
		return stream.getInt32();
	}
}

export default YodaReader;
