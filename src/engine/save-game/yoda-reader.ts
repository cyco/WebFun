import Reader from "./reader";
import SaveState from "./save-state";
import GameData from "../game-data";
import { InputStream, Point } from "src/util";
import { Action, Hotspot, HotspotType, NPC, Tile, Zone } from "src/engine/objects";
import { MutableHotspot, MutableNPC, MutableZone } from "src/engine/mutable-objects";
import { Planet, WorldSize } from "../types";
import World from "./world";
import WorldItem from "./world-item";
import { Yoda } from "../type";

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
		const state = this._state;
		const zones = this._data.zones;

		let seed = stream.getUint32() & 0xffff;

		let planet = stream.getUint32();
		let on_dagobah = stream.getUint32() != 0;

		this.readPuzzles(stream);
		this.readPuzzles(stream);
		this.readWorld(stream, zones, { start: 4, end: 6 }, { start: 4, end: 6 });
		this.readWorld(stream, zones, { start: 0, end: 10 }, { start: 0, end: 10 });
		this.readInventory(stream);

		let current_zone_id = stream.getUint16();
		let pos_x_on_world = stream.getUint32();
		let pos_y_on_world = stream.getUint32();

		let point: Point = new Point(0, 0);
		let current_weapon = stream.getInt16();
		let currentAmmo = current_weapon >= 0 ? stream.getInt16() : -1;

		let force_ammo = stream.getInt16();
		let blaster_ammo = stream.getInt16();
		let blaster_rifle_ammo = stream.getInt16();

		let pos_x_on_zone = stream.getUint32() / Tile.WIDTH;
		let pos_y_on_zone = stream.getUint32() / Tile.HEIGHT;

		let damage_taken = stream.getUint32();
		let lives_left = stream.getUint32();
		let difficulty = stream.getUint32();
		let time_elapsed = stream.getUint32();

		let world_size = stream.getInt16();
		let unknown_count = stream.getInt16();
		let unknown_sum = stream.getInt16();
		let unknown_thing = stream.getInt16();

		let goal_puzzle = stream.getUint32();
		let goal_puzzle_again = stream.getUint32();

		point = new Point(pos_x_on_zone, pos_y_on_zone);

		console.assert(
			stream.isAtEnd(),
			`Encountered ${stream.length - stream.offset} unknown bytes at end of stream`
		);

		return state;
	}

	protected readWorldItem(stream: InputStream, x: number, y: number): WorldItem {
		let visited = this.readBool(stream);
		let solved_1 = this.readBool(stream);
		let solved_2 = this.readBool(stream);

		let solved_3 = stream.getUint32() != 0;
		let solved_4 = stream.getUint32() != 0;

		let zone_id = stream.getInt16();
		let field_c = stream.getInt16();
		let required_item_id = stream.getInt16();
		let find_item_id = stream.getInt16();
		let field_ea = stream.getInt16();
		let additional_required_item_id = stream.getInt16();
		let field_16 = stream.getInt16();
		let npc_id = stream.getInt16();

		let unknown_1 = stream.getInt32();
		let unknown_2 = stream.getInt16();

		const worldItem = new WorldItem();
		worldItem.visited = visited;
		worldItem.solved_1 = solved_1 ? 1 : 0;
		worldItem.solved_2 = solved_2 ? 1 : 0;
		worldItem.solved_3 = solved_3 ? 1 : 0;
		worldItem.solved_4 = solved_4 ? 1 : 0;
		worldItem.zoneId = zone_id;
		worldItem.field_C = field_c;
		worldItem.required_item_id = required_item_id;
		worldItem.find_item_id = find_item_id;
		worldItem.field_Ea = field_ea;
		worldItem.additionalRequiredItem = additional_required_item_id;
		worldItem.field_16 = worldItem.field_16;
		worldItem.npc_id = worldItem.npc_id;

		return worldItem;
	}

	protected readNPC(stream: InputStream): void {
		let character_id = stream.getInt16();
		let x = stream.getInt16();
		let y = stream.getInt16();
		let field_a = stream.getInt16();
		let enabled = stream.getUint32() != 0;
		let field_10 = stream.getInt16();
		let field_x__ = stream.getInt16();
		let field_y__ = stream.getInt16();
		let current_frame = stream.getInt16();
		let field_18 = stream.getUint32();
		let field_1c = stream.getUint32();
		let field_2 = stream.getUint32();
		let field_x_ = stream.getInt16();
		let field_y_ = stream.getInt16();
		let field_3c = stream.getInt16();
		let field_3e = stream.getInt16();
		let field_60 = stream.getInt16();
		let field_26 = stream.getInt16();
		let field_2c = stream.getUint32();
		let field_34 = stream.getUint32();
		let field_28 = stream.getUint32();

		let field_24 = stream.getInt16();
		let unknown = stream.getInt16();

		for (let i = 0; i < 4; i++) {
			stream.getUint32();
			stream.getUint32();
		}
	}

	protected readHotspot(stream: InputStream, oldHotspot: Hotspot): Hotspot {
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
