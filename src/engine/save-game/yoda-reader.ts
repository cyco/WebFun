import { Tile, Zone } from "src/engine/objects";
import { InputStream, Point } from "src/util";

import Reader from "./reader";
import SaveState, { SavedHotspot, SavedMonster, SavedSector } from "./save-state";
import { Yoda } from "src/variant";
import { floor } from "src/std/math";

class YodaReader extends Reader {
	constructor(stream: InputStream) {
		super(stream, Yoda);
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
			`Expected goal ${goalPuzzle} to be repeated. Found ${goalPuzzleAgain} instead`
		);
		console.assert(
			stream.isAtEnd(),
			`Encountered ${stream.length - stream.offset} unknown bytes at end of stream`
		);

		const state = this._state;
		state.type = Yoda;
		state.planet = Zone.Planet.isPlanet(planet) ? Zone.Planet.fromNumber(planet) : Zone.Planet.None;
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
		state.worldSize = worldSize;

		return state;
	}

	protected readSector(stream: InputStream, _x: number, _y: number): SavedSector {
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

		const unknown = stream.readInt32();
		const usedAlternateStrain = stream.readInt16();

		return {
			visited,
			solved1,
			solved2,
			solved3,
			solved4,
			zone: zoneId,
			puzzleIndex,
			requiredItem: requiredItemId,
			findItem: findItemId,
			isGoal: !!isGoal,
			additionalRequiredItem: additionalRequiredItem,
			additionalGainItem: additionalGainItem,
			usedAlternateStrain: usedAlternateStrain === -1 ? null : usedAlternateStrain === 1,
			npc: npcId,
			unknown
		};
	}

	protected readMonster(stream: InputStream): SavedMonster {
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

		const bulletOffset = stream.readInt16();
		const facingDirection = stream.readInt16();
		const field60 = stream.readInt16();
		const loot = stream.readInt16();
		const flag2c = stream.readUint32() !== 0;
		const flag34 = stream.readUint32() !== 0;
		const hasItem = stream.readUint32() !== 0;
		const cooldown = stream.readInt16();
		const preferred = stream.readInt16();

		const waypoints: Point[] = [];
		for (let i = 0; i < 4; i++) {
			waypoints.push(new Point(stream.readUint32(), stream.readUint32()));
		}

		return {
			face: characterId,
			enabled: enabled,
			position: new Point(x, y, Zone.Layer.Object),
			damageTaken: damageTaken,
			loot: loot,
			field10: field10,
			bulletX: bulletX,
			bulletY: bulletY,
			currentFrame: currentFrame,
			facingDirection: facingDirection,
			cooldown: cooldown,
			flag18: flag18,
			flag20: flag20,
			flag1c: flag1c,
			directionX: directionX,
			directionY: directionY,
			bulletOffset: bulletOffset,
			field60: field60,
			flag2c: flag2c,
			flag34: flag34,
			hasItem: hasItem,
			preferredDirection: preferred,
			waypoints: waypoints
		};
	}

	protected readHotspot(stream: InputStream): SavedHotspot {
		const enabled = stream.readUint16() !== 0;
		const argument = stream.readInt16();
		const type = stream.readUint32();
		const x = stream.readInt16();
		const y = stream.readInt16();

		return {
			enabled,
			type,
			argument,
			x,
			y
		};
	}

	protected readInt(stream: InputStream): number {
		return stream.readInt32();
	}
}

export default YodaReader;
