import { Action, Hotspot, Monster, Tile, Zone } from "src/engine/objects";

import { OutputStream } from "src/util";
import SaveState from "./save-state";
import World from "src/engine/world";
import Sector from "src/engine/sector";
import AssetManager from "../asset-manager";

class Writer {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public write(state: SaveState, stream: OutputStream): void {
		throw "Not implemented yet!";
		//stream.writeCharacters("YODASAV44");
		//stream.writeUint32(state.seed);
		//stream.writeUint32(state.planet.rawValue);

		//stream.writeUint32(+state.onDagobah);

		//stream.writeUint16(state.puzzleIDs1.length);
		//stream.writeUint16Array(state.puzzleIDs1);

		//stream.writeUint16(state.puzzleIDs2.length);
		//stream.writeUint16Array(state.puzzleIDs2);

		//this._writeDagobah(state.dagobah, stream);
		//this._writeWorld(state.world, stream);

		//stream.writeInt32(state.inventoryIDs.length);
		//stream.writeInt16Array(state.inventoryIDs);

		//stream.writeInt16(state.currentZoneID);

		//stream.writeUint32(state.positionOnWorld.x);
		//stream.writeUint32(state.positionOnWorld.y);

		//stream.writeInt16(state.currentWeapon);
		//if (state.currentWeapon !== -1) {
		//stream.writeInt16(state.currentAmmo);
		//}

		//stream.writeInt16(state.forceAmmo);
		//stream.writeInt16(state.blasterAmmo);
		//stream.writeInt16(state.blasterRifleAmmo);

		//stream.writeUint32(state.positionOnZone.x * Tile.WIDTH);
		//stream.writeUint32(state.positionOnZone.y * Tile.HEIGHT);

		//stream.writeUint32(state.damageTaken);
		//stream.writeUint32(state.livesLost);

		//stream.writeUint32(state.difficulty);
		//stream.writeUint32(state.timeElapsed);

		//stream.writeInt32(state.worldSize);

		//stream.writeInt16(state.unknownCount);
		//stream.writeInt16(state.unknownSum);

		//stream.writeUint32(state.goalPuzzle);
		//stream.writeUint32(state.goalPuzzle);
	}

	private _writeDagobah(world: World, stream: OutputStream): void {
		for (let y = 4; y <= 5; y++) {
			for (let x = 4; x <= 5; x++) {
				this._writeSector(world.at(x, y), stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	private _writeWorld(world: World, stream: OutputStream): void {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				this._writeSector(world.at(x, y), stream);
			}
		}

		this._writeWorldDetails(world, stream);
	}

	private _writeRoom(zone: Zone, visited: boolean, stream: OutputStream): void {
		this._writeZone(zone, visited, stream);
		const doors = zone.hotspots.filter(
			(hotspot: Hotspot) => hotspot.type === Hotspot.Type.DoorIn && hotspot.arg !== -1
		);
		doors.forEach((hotspot: Hotspot) => {
			const zone = this._assets.get(Zone, hotspot.arg);
			stream.writeInt16(zone.id);
			stream.writeUint32(zone.visited ? 1 : 0);
			this._writeRoom(zone, visited, stream);
		});
	}

	private _writeZone(zone: Zone, visited: boolean, stream: OutputStream): void {
		if (visited) {
			stream.writeUint32(zone.counter);
			stream.writeUint32(zone.random);
			stream.writeInt32(zone.doorInLocation.x);
			stream.writeInt32(zone.doorInLocation.y);
			stream.writeInt16(zone.sectorCounter);
			stream.writeUint16(zone.planet.rawValue);

			stream.writeInt16Array(zone.tileIDs);
		}

		stream.writeUint32(+zone.visited);

		stream.writeUint32(zone.hotspots.length);
		zone.hotspots.forEach((hotspot: Hotspot) => this._writeHotspot(hotspot, stream));

		if (visited) {
			stream.writeUint32(zone.monsters.length);
			zone.monsters.forEach((monster: Monster) => this.writeMonster(monster, stream));

			stream.writeUint32(zone.actions.length);
			zone.actions.forEach((action: Action) => stream.writeUint32(+action.enabled));
		}
	}

	private writeMonster(monster: Monster, stream: OutputStream): void {
		stream.writeInt16(monster.alive ? monster.face.id : -1);
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

	private _writeHotspot(hotspot: Hotspot, stream: OutputStream): void {
		stream.writeUint16(+hotspot.enabled);
		stream.writeInt16(hotspot.arg);
		stream.writeUint32(hotspot.type.rawValue);
		stream.writeInt16(hotspot.x);
		stream.writeInt16(hotspot.y);
	}

	private _writeWorldDetails(world: World, stream: OutputStream): void {
		for (let y = 0; y < World.Size.height; y++) {
			for (let x = 0; x < World.Size.width; x++) {
				const item = world.at(x, y);
				if (!item || !item.zone) continue;

				stream.writeInt32(x);
				stream.writeInt32(y);

				stream.writeInt16(item.zone.id);
				stream.writeUint32(+item.visited);

				this._writeRoom(item.zone, item.visited, stream);
			}
		}

		stream.writeInt32(-1);
		stream.writeInt32(-1);
	}

	private _writeSector(sector: Sector, stream: OutputStream): void {
		const id = (item: Tile | Zone) => (item ? item.id : -1);

		stream.writeUint32(+sector.visited);

		stream.writeUint32(+sector.solved1);
		stream.writeUint32(+sector.solved3);
		stream.writeUint32(+sector.solved2);
		stream.writeUint32(+sector.solved4);

		stream.writeInt16(id(sector.zone));
		stream.writeInt16(sector.puzzleIndex);
		stream.writeInt16(id(sector.requiredItem));
		stream.writeInt16(id(sector.findItem));
		stream.writeInt16(sector.isGoal);
		stream.writeInt16(id(sector.additionalRequiredItem));
		stream.writeInt16(id(sector.additionalGainItem));
		stream.writeInt16(id(sector.npc));

		stream.writeInt32(sector.unknown);
		stream.writeInt16(sector.usedAlternateStrain === null ? -1 : +sector.usedAlternateStrain);
	}
}

export default Writer;
