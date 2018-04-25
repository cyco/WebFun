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
		const state = this._state;
		const zones = this._data.zones;

		let seed = stream.getUint32() & 0xffff;

		this.readPuzzles(stream);
		this.readWorld(stream, zones, { start: 0, end: 10 }, { start: 0, end: 10 });
		this.readInventory(stream);

		let current_zone_id = stream.getUint16();
		let pos_x_on_world = stream.getUint16();
		let pos_y_on_world = stream.getUint16();

		let _unknown1 = stream.getUint16();
		let x = stream.getUint16();
		let y = stream.getUint16();
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
