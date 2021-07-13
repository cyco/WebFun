import { Hotspot, Tile } from "src/engine/objects";

import { OutputStream } from "src/util";
import SaveState, {
	SavedAction,
	SavedHotspot,
	SavedMonster,
	SavedSector,
	SavedWorld
} from "./save-state";
import World from "../world";

class Writer {
	private _state: SaveState;

	constructor() {}

	public write(state: SaveState, stream: OutputStream): void {
		try {
			this._state = state;
			stream.writeCharacters("YODASAV44");
			stream.writeUint32(state.seed);
			stream.writeUint32(state.planet.rawValue);

			stream.writeUint32(+state.onDagobah);

			stream.writeUint16(state.puzzleIDs1.length);
			stream.writeUint16Array(state.puzzleIDs1);

			stream.writeUint16(state.puzzleIDs2.length);
			stream.writeUint16Array(state.puzzleIDs2);

			this._writeDagobah(state.dagobah, stream);
			this._writeWorld(state.world, stream);

			stream.writeInt32(state.inventoryIDs.length);
			stream.writeInt16Array(state.inventoryIDs);

			stream.writeInt16(state.currentZoneID);

			stream.writeUint32(state.positionOnWorld.x);
			stream.writeUint32(state.positionOnWorld.y);

			stream.writeInt16(state.currentWeapon);
			if (state.currentWeapon !== -1) {
				stream.writeInt16(state.currentAmmo);
			}

			stream.writeInt16(state.forceAmmo);
			stream.writeInt16(state.blasterAmmo);
			stream.writeInt16(state.blasterRifleAmmo);

			stream.writeUint32(state.positionOnZone.x * Tile.WIDTH);
			stream.writeUint32(state.positionOnZone.y * Tile.HEIGHT);

			stream.writeUint32(state.damageTaken);
			stream.writeUint32(state.livesLost);

			stream.writeUint32(state.difficulty);
			stream.writeUint32(state.timeElapsed);

			stream.writeInt32(state.worldSize);

			stream.writeInt16(state.unknownCount);
			stream.writeInt16(state.unknownSum);

			stream.writeUint32(state.goalPuzzle);
			stream.writeUint32(state.goalPuzzle);
		} finally {
			this._state = null;
		}
	}

	private _writeDagobah(world: SavedWorld, stream: OutputStream): void {
		for (let y = 4; y <= 5; y++) {
			for (let x = 4; x <= 5; x++) {
				this._writeSector(world.sectors[y * World.Size.width + x], stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	private _writeWorld(world: SavedWorld, stream: OutputStream): void {
		for (let y = 0; y < World.Size.height; y++) {
			for (let x = 0; x < World.Size.width; x++) {
				this._writeSector(world.sectors[y * World.Size.width + x], stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	private _writeRoom(zoneID: number, visited: boolean, stream: OutputStream): void {
		this._writeZone(zoneID, visited, stream);
		const doors = this._state.hotspots
			.get(zoneID)
			.filter(
				(hotspot: SavedHotspot) =>
					hotspot.type === Hotspot.Type.DoorIn.rawValue && hotspot.argument !== -1
			);
		doors.forEach((hotspot: SavedHotspot) => {
			const zone = this._state.zones.get(hotspot.argument);
			stream.writeInt16(zone.id);
			stream.writeUint32(zone.visited ? 1 : 0);
			this._writeRoom(hotspot.argument, visited, stream);
		});
	}

	private _writeZone(zoneID: number, visited: boolean, stream: OutputStream): void {
		const zone = this._state.zones.get(zoneID);
		if (visited) {
			stream.writeUint32(zone.counter);
			stream.writeUint32(zone.random);
			stream.writeInt32(zone.doorInLocation.x);
			stream.writeInt32(zone.doorInLocation.y);
			stream.writeInt16(zone.sectorCounter);
			stream.writeUint16(zone.planet);

			stream.writeInt16Array(zone.tileIDs);
		}

		stream.writeUint32(zone && zone.visited ? 1 : 0);

		const hotspots = this._state.hotspots.get(zoneID);
		stream.writeUint32(hotspots.length);
		hotspots.forEach((hotspot: SavedHotspot) => this._writeHotspot(hotspot, stream));

		if (visited) {
			const monsters = this._state.monsters.get(zoneID);
			stream.writeUint32(monsters.length);
			monsters.forEach((monster: SavedMonster) => this.writeMonster(monster, stream));

			const actions = this._state.actions.get(zoneID);
			stream.writeUint32(actions.length);
			actions.forEach((action: SavedAction) => stream.writeUint32(action ? 1 : 0));
		}
	}

	private writeMonster(monster: SavedMonster, stream: OutputStream): void {
		stream.writeInt16(monster.face);
		stream.writeInt16(monster.position.x);
		stream.writeInt16(monster.position.y);
		stream.writeInt16(monster.damageTaken);
		stream.writeUint32(+monster.enabled);

		stream.writeInt16(monster.field10);
		stream.writeInt16(monster.bulletX);
		stream.writeInt16(monster.bulletY);
		stream.writeInt16(monster.currentFrame);
		stream.writeUint32(+monster.flag18);
		stream.writeUint32(+monster.flag1c);
		stream.writeUint32(+monster.flag20);
		stream.writeInt16(monster.directionX);
		stream.writeInt16(monster.directionY);
		stream.writeInt16(monster.bulletOffset);
		stream.writeInt16(monster.facingDirection);
		stream.writeInt16(monster.field60);
		stream.writeInt16(monster.loot);

		stream.writeUint32(+monster.flag2c);
		stream.writeUint32(+monster.flag34);
		stream.writeUint32(+monster.hasItem);
		stream.writeInt16(monster.cooldown);
		stream.writeInt16(monster.preferredDirection);

		for (let i = 0; i < 4; i++) {
			const waypoint = monster.waypoints[i];
			stream.writeInt32(waypoint.x);
			stream.writeInt32(waypoint.y);
		}
	}

	private _writeHotspot(hotspot: SavedHotspot, stream: OutputStream): void {
		stream.writeUint16(+hotspot.enabled);
		stream.writeInt16(hotspot.argument);
		stream.writeUint32(hotspot.type);
		stream.writeInt16(hotspot.x);
		stream.writeInt16(hotspot.y);
	}

	private _writeWorldDetails(world: SavedWorld, stream: OutputStream): void {
		for (let y = 0; y < World.Size.height; y++) {
			for (let x = 0; x < World.Size.width; x++) {
				const item = world.sectors[y * World.Size.width + x];
				if (!item || !item.zone || item.zone === -1) continue;

				stream.writeInt32(x);
				stream.writeInt32(y);

				stream.writeInt16(item.zone);
				stream.writeUint32(+item.visited);

				this._writeRoom(item.zone, item.visited, stream);
			}
		}

		stream.writeInt32(-1);
		stream.writeInt32(-1);
	}

	private _writeSector(sector: SavedSector, stream: OutputStream): void {
		stream.writeUint32(+sector.visited);

		stream.writeUint32(+sector.solved1);
		stream.writeUint32(+sector.solved3);
		stream.writeUint32(+sector.solved2);
		stream.writeUint32(+sector.solved4);

		stream.writeInt16(sector.zone);
		stream.writeInt16(sector.puzzleIndex);
		stream.writeInt16(sector.requiredItem);
		stream.writeInt16(sector.findItem);
		stream.writeInt16(sector.isGoal ? 1 : 0);
		stream.writeInt16(sector.additionalRequiredItem);
		stream.writeInt16(sector.additionalGainItem);
		stream.writeInt16(sector.npc);

		stream.writeInt32(sector.unknown);
		stream.writeInt16(sector.usedAlternateStrain === null ? -1 : +sector.usedAlternateStrain);
	}
}

export default Writer;
