import { InputStream, Point } from "src/util";

import { Hotspot, Char, Zone, Tile } from "src/engine/objects";
import { Indy } from "src/engine/type";
import { MutableHotspot, MutableMonster } from "src/engine/mutable-objects";
import Reader from "./reader";
import SaveState from "./save-state";
import Sector from "src/engine/sector";
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

		const state = new SaveState();
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

	protected readSector(stream: InputStream, _x: number, _y: number): Sector {
		const visited = this.readBool(stream);
		const solved1 = this.readBool(stream);
		const solved2 = this.readBool(stream);

		const zoneID = stream.readInt16();
		const puzzleIndex = stream.readInt16();

		const requiredItemID = stream.readInt16();
		const findItemID = stream.readInt16();

		const npcID = stream.readInt16();
		// possibly zone or puzzle type, skip over it
		stream.readInt16();

		const sector = new Sector();
		sector.visited = visited;
		sector.solved1 = solved1;
		sector.solved2 = solved2;
		sector.zone = this._assets.get(Zone, zoneID, NullIfMissing);
		sector.puzzleIndex = puzzleIndex;
		sector.requiredItem = this._assets.get(Tile, requiredItemID, NullIfMissing);
		sector.findItem = this._assets.get(Tile, findItemID, NullIfMissing);
		sector.npc = this._assets.get(Tile, npcID, NullIfMissing);

		return sector;
	}

	protected readHotspot(stream: InputStream, oldHotspot: Hotspot): Hotspot {
		const enabled = stream.readUint16() !== 0;
		const argument = stream.readInt16();

		const hotspot = new MutableHotspot();
		hotspot.enabled = enabled;
		hotspot.type = oldHotspot.type;
		hotspot.arg = argument;
		hotspot.x = oldHotspot.x;
		hotspot.y = oldHotspot.y;
		return hotspot;
	}

	protected readMonster(stream: InputStream): MutableMonster {
		const characterId = stream.readInt16();
		const x = stream.readInt16();
		const y = stream.readInt16();
		const damageTaken = stream.readInt16();

		stream.readUint8Array(0x18);

		const monster = new MutableMonster();
		monster.face = this._assets.get(Char, characterId, NullIfMissing);
		monster.position = new Point(x, y);
		monster.damageTaken = damageTaken;

		return monster;
	}

	protected readInt(stream: InputStream): number {
		return stream.readInt16();
	}
}

export default IndyReader;
