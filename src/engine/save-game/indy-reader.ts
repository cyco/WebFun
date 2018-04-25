import Reader from "./reader";
import SaveState from "./save-state";
import GameData from "../game-data";
import { InputStream, Point } from "src/util";
import { Action, Hotspot, HotspotType, NPC, Tile, Zone } from "src/engine/objects";
import { MutableHotspot, MutableNPC, MutableZone } from "src/engine/mutable-objects";
import { Planet, WorldSize } from "../types";
import World from "./world";
import WorldItem from "./world-item";
import { Indy } from "src/engine/type";

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

		let seed = stream.getUint32() & 0xffff;

		const puzzleIDs1 = this.readPuzzles(stream);
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		let current_zone_id = stream.getUint16();
		let pos_x_on_world = stream.getUint16();
		let pos_y_on_world = stream.getUint16();

		let _unknown1 = stream.getUint16();
		let pos_x_on_zone = stream.getUint16();
		let pos_y_on_zone = stream.getUint16();
		let u2 = stream.getInt16();
		let u3 = stream.getInt16();
		let u4 = stream.getInt16();
		let u5 = stream.getInt16();

		let u6 = stream.getInt16();
		let u7 = stream.getInt16();
		let u8 = stream.getInt16();
		let u9 = stream.getInt16();

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
		state.currentZoneID = current_zone_id;
		state.positionOnZone = new Point(pos_x_on_zone, pos_y_on_zone);
		state.positionOnWorld = new Point(pos_x_on_world, pos_y_on_world);
		state.goalPuzzle = u9;
		state.world = world;

		state.damageTaken = 0;
		state.livesLeft = 3;

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
		state.unknownThing = unknown_thing;
		*/

		return state;
	}

	protected readWorldItem(stream: InputStream, x: number, y: number): WorldItem {
		let visited = this.readBool(stream);
		let solved_1 = this.readBool(stream);
		let solved_2 = this.readBool(stream);

		let zone_id = stream.getInt16();
		let field_c = stream.getInt16();

		let required_item_id = stream.getInt16();
		let find_item_id = stream.getInt16();

		let npc_id = stream.getInt16();
		// possibly zone or puzzle type
		let unkonwn = stream.getInt16();

		return new WorldItem();
	}

	protected readHotspot(stream: InputStream, oldHotspot: Hotspot): Hotspot {
		let enabled = stream.getUint16() != 0;
		let argument = stream.getInt16();

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
