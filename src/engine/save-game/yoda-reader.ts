import { Hotspot, Tile, Char, Zone } from "src/engine/objects";
import { InputStream, Point } from "src/util";
import { MutableHotspot, MutableNPC } from "src/engine/mutable-objects";
import { Planet, WorldSize } from "../types";

import Reader from "./reader";
import SaveState from "./save-state";
import Sector from "src/engine/sector";
import { Yoda } from "../type";
import { floor } from "src/std/math";
import AssetManager, { NullIfMissing } from "src/engine/asset-manager";

class YodaReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Yoda);
	}

	public read(assets: AssetManager): SaveState {
		this._assets = assets;
		return this._doRead();
	}

	protected _doRead(): SaveState {
		const stream = this._stream;

		const seed = stream.getUint32() & 0xffff;

		const planet = stream.getUint32();
		const onDagobah = stream.getUint32() !== 0;

		const puzzleIDs1 = this.readPuzzles(stream);
		const puzzleIDs2 = this.readPuzzles(stream);
		const dagobah = this.readWorld(stream, { start: 4, end: 6 }, { start: 4, end: 6 });
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		const currentZoneID = stream.getUint16();
		const posXOnWorld = stream.getUint32();
		const posYOnWorld = stream.getUint32();

		const currentWeapon = stream.getInt16();
		const currentAmmo = currentWeapon >= 0 ? stream.getInt16() : -1;

		const forceAmmo = stream.getInt16();
		const blasterAmmo = stream.getInt16();
		const blasterRifleAmmo = stream.getInt16();

		const posXOnZone = floor(stream.getUint32() / Tile.WIDTH);
		const posYOnZone = floor(stream.getUint32() / Tile.HEIGHT);

		const damageTaken = stream.getInt32();
		const livesLost = stream.getInt32();

		const difficulty = stream.getUint32();
		const timeElapsed = stream.getUint32();

		const worldSize = stream.getInt32();
		const unknownCount = stream.getInt16();
		const unknownSum = stream.getInt16();

		const goalPuzzle = stream.getUint32();
		const goalPuzzleAgain = stream.getUint32();

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
		state.planet = Planet.isPlanet(planet) ? Planet.fromNumber(planet) : Planet.NONE;
		state.seed = seed;
		state.puzzleIDs1 = puzzleIDs1;
		state.puzzleIDs2 = puzzleIDs2;
		state.inventoryIDs = inventoryIDs;
		state.onDagobah = onDagobah;
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
		state.timeElapsed = timeElapsed;
		state.difficulty = difficulty;
		state.unknownCount = unknownCount;
		state.unknownSum = unknownSum;
		try {
			state.worldSize = WorldSize.fromNumber(1 + worldSize);
		} catch (_) {
			state.worldSize = WorldSize.Small;
		}
		return state;
	}

	protected readSector(stream: InputStream, _x: number, _y: number): Sector {
		const visited = this.readBool(stream);
		const solved1 = this.readBool(stream);
		const solved2 = this.readBool(stream);
		const solved3 = this.readBool(stream);
		const solved4 = this.readBool(stream);

		const zoneId = stream.getInt16();
		const puzzleType = stream.getInt16();
		const requiredItemId = stream.getInt16();
		const findItemId = stream.getInt16();
		const isGoal = stream.getInt16();
		const additionalRequiredItem = stream.getInt16();
		const additionalGainItem = stream.getInt16();
		const npcId = stream.getInt16();

		const zoneType = stream.getInt32();
		const usedAlternateStrain = stream.getInt16();

		const sector = new Sector();
		sector.visited = visited;
		sector.solved1 = solved1;
		sector.solved2 = solved2;
		sector.solved3 = solved3;
		sector.solved4 = solved4;
		sector.zone = this._assets.get(Zone, zoneId, NullIfMissing);
		sector.puzzleType = puzzleType;
		sector.requiredItem = this._assets.get(Tile, requiredItemId, NullIfMissing);
		sector.findItem = this._assets.get(Tile, findItemId, NullIfMissing);
		sector.isGoal = isGoal;
		sector.additionalRequiredItem = this._assets.get(Tile, additionalRequiredItem, NullIfMissing);
		sector.additionalGainItem = additionalGainItem;
		sector.usedAlternateStrain = usedAlternateStrain === -1 ? null : usedAlternateStrain === 1;
		sector.npc = this._assets.get(Tile, npcId, NullIfMissing);
		sector.zoneType = Zone.Type.isZoneType(zoneType) ? Zone.Type.fromNumber(zoneType) : Zone.Type.None;

		return sector;
	}

	protected readNPC(stream: InputStream): MutableNPC {
		const characterId = stream.getInt16();
		const x = stream.getInt16();
		const y = stream.getInt16();
		const damageTaken = stream.getInt16();
		const enabled = stream.getUint32() !== 0;
		const field10 = stream.getInt16();

		const bulletX = stream.getInt16();
		const bulletY = stream.getInt16();
		const currentFrame = stream.getInt16();
		const flag18 = stream.getUint32() !== 0;
		const flag1c = stream.getUint32() !== 0;
		const flag20 = stream.getUint32() !== 0;
		const directionX = stream.getInt16();
		const directionY = stream.getInt16();

		const field3c = stream.getInt16();
		const facingDirection = stream.getInt16();
		const field60 = stream.getInt16();
		const loot = stream.getInt16();
		const flag2c = stream.getUint32() !== 0;
		const flag34 = stream.getUint32() !== 0;
		const hasItem = stream.getUint32() !== 0;
		const cooldown = stream.getInt16();
		const preferred = stream.getInt16();

		for (let i = 0; i < 4; i++) {
			stream.getUint32();
			stream.getUint32();
		}

		const npc = new MutableNPC();
		npc.face = this._assets.get(Char, characterId, NullIfMissing);
		npc.enabled = enabled;
		npc.position = new Point(x, y);
		npc.damageTaken = damageTaken;
		npc.loot = loot;
		npc.field10 = field10;
		npc.bulletX = bulletX;
		npc.bulletY = bulletY;
		npc.currentFrame = currentFrame;
		npc.facingDirection = facingDirection;
		npc.cooldown = cooldown;
		npc.flag18 = flag18;
		npc.flag20 = flag20;
		npc.flag1c = flag1c;
		npc.directionX = directionX;
		npc.directionY = directionY;
		npc.field3c = field3c;
		npc.field60 = field60;
		npc.flag2c = flag2c;
		npc.flag34 = flag34;
		npc.hasItem = hasItem;
		npc.preferredDirection = preferred;

		return npc;
	}

	protected readHotspot(stream: InputStream, _: Hotspot): Hotspot {
		const enabled = stream.getUint16() !== 0;
		const argument = stream.getInt16();
		const type = Hotspot.Type.fromNumber(stream.getUint32());
		const x = stream.getInt16();
		const y = stream.getInt16();

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
