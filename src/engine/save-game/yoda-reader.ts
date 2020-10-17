import { Hotspot, Tile, Char, Zone } from "src/engine/objects";
import { InputStream, Point } from "src/util";
import { MutableHotspot, MutableMonster } from "src/engine/mutable-objects";
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

		const seed = stream.readUint32() & 0xffff;

		const planet = stream.readUint32();
		const onDagobah = stream.readUint32() !== 0;

		const puzzleIDs1 = this.readPuzzles(stream);
		const puzzleIDs2 = this.readPuzzles(stream);
		const dagobah = this.readWorld(stream, { start: 4, end: 6 }, { start: 4, end: 6 });
		const world = this.readWorld(stream, { start: 0, end: 10 }, { start: 0, end: 10 });
		const inventoryIDs = this.readInventory(stream);

		const currentZoneID = stream.readUint16();
		const posXOnWorld = stream.readUint32();
		const posYOnWorld = stream.readUint32();

		const currentWeapon = stream.readInt16();
		const currentAmmo = currentWeapon >= 0 ? stream.readInt16() : -1;

		const forceAmmo = stream.readInt16();
		const blasterAmmo = stream.readInt16();
		const blasterRifleAmmo = stream.readInt16();

		const posXOnZone = floor(stream.readUint32() / Tile.WIDTH);
		const posYOnZone = floor(stream.readUint32() / Tile.HEIGHT);

		const damageTaken = stream.readInt32();
		const livesLost = stream.readInt32();

		const difficulty = stream.readUint32();
		const timeElapsed = stream.readUint32();

		const worldSize = stream.readInt32();
		const unknownCount = stream.readInt16();
		const unknownSum = stream.readInt16();

		const goalPuzzle = stream.readUint32();
		const goalPuzzleAgain = stream.readUint32();

		console.assert(
			goalPuzzle === goalPuzzleAgain,
			`Expected goal ${goalPuzzle} to be reapeted. Found ${goalPuzzleAgain} instead`
		);
		console.assert(stream.isAtEnd(), `Encountered ${stream.length - stream.offset} unknown bytes at end of stream`);

		const state = new SaveState();
		state.type = Yoda;
		state.planet = Planet.isPlanet(planet) ? Planet.fromNumber(planet) : Planet.None;
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

		const zoneId = stream.readInt16();
		const puzzleIndex = stream.readInt16();
		const requiredItemId = stream.readInt16();
		const findItemId = stream.readInt16();
		const isGoal = stream.readInt16();
		const additionalRequiredItem = stream.readInt16();
		const additionalGainItem = stream.readInt16();
		const npcId = stream.readInt16();

		const zoneType = stream.readInt32();
		const usedAlternateStrain = stream.readInt16();

		const sector = new Sector();
		sector.visited = visited;
		sector.solved1 = solved1;
		sector.solved2 = solved2;
		sector.solved3 = solved3;
		sector.solved4 = solved4;
		sector.zone = this._assets.get(Zone, zoneId, NullIfMissing);
		sector.puzzleIndex = puzzleIndex;
		sector.requiredItem = this._assets.get(Tile, requiredItemId, NullIfMissing);
		sector.findItem = this._assets.get(Tile, findItemId, NullIfMissing);
		sector.isGoal = isGoal;
		sector.additionalRequiredItem = this._assets.get(Tile, additionalRequiredItem, NullIfMissing);
		sector.additionalGainItem = this._assets.get(Tile, additionalGainItem, NullIfMissing);
		sector.usedAlternateStrain = usedAlternateStrain === -1 ? null : usedAlternateStrain === 1;
		sector.npc = this._assets.get(Tile, npcId, NullIfMissing);
		sector.zoneType = Zone.Type.isZoneType(zoneType) ? Zone.Type.fromNumber(zoneType) : Zone.Type.None;

		return sector;
	}

	protected readMonster(stream: InputStream): MutableMonster {
		const characterId = stream.readInt16();
		const x = stream.readInt16();
		const y = stream.readInt16();
		const damageTaken = stream.readInt16();
		const enabled = stream.readUint32() !== 0;
		const field10 = stream.readInt16();

		const bulletX = stream.readInt16();
		const bulletY = stream.readInt16();
		const currentFrame = stream.readInt16();
		const flag18 = stream.readUint32() !== 0;
		const flag1c = stream.readUint32() !== 0;
		const flag20 = stream.readUint32() !== 0;
		const directionX = stream.readInt16();
		const directionY = stream.readInt16();

		const field3c = stream.readInt16();
		const facingDirection = stream.readInt16();
		const field60 = stream.readInt16();
		const loot = stream.readInt16();
		const flag2c = stream.readUint32() !== 0;
		const flag34 = stream.readUint32() !== 0;
		const hasItem = stream.readUint32() !== 0;
		const cooldown = stream.readInt16();
		const preferred = stream.readInt16();

		for (let i = 0; i < 4; i++) {
			stream.readUint32();
			stream.readUint32();
		}

		const monster = new MutableMonster();
		monster.face = this._assets.get(Char, characterId, NullIfMissing);
		monster.enabled = enabled;
		monster.position = new Point(x, y);
		monster.damageTaken = damageTaken;
		monster.loot = loot;
		monster.field10 = field10;
		monster.bulletX = bulletX;
		monster.bulletY = bulletY;
		monster.currentFrame = currentFrame;
		monster.facingDirection = facingDirection;
		monster.cooldown = cooldown;
		monster.flag18 = flag18;
		monster.flag20 = flag20;
		monster.flag1c = flag1c;
		monster.directionX = directionX;
		monster.directionY = directionY;
		monster.field3c = field3c;
		monster.field60 = field60;
		monster.flag2c = flag2c;
		monster.flag34 = flag34;
		monster.hasItem = hasItem;
		monster.preferredDirection = preferred;

		return monster;
	}

	protected readHotspot(stream: InputStream, _: Hotspot): Hotspot {
		const enabled = stream.readUint16() !== 0;
		const argument = stream.readInt16();
		const type = Hotspot.Type.fromNumber(stream.readUint32());
		const x = stream.readInt16();
		const y = stream.readInt16();

		const hotspot = new MutableHotspot();
		hotspot.enabled = enabled;
		hotspot.type = type;
		hotspot.arg = argument;
		hotspot.x = x;
		hotspot.y = y;

		return hotspot;
	}

	protected readInt(stream: InputStream): number {
		return stream.readInt32();
	}
}

export default YodaReader;
