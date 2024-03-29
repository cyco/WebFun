import {
	Action,
	Character,
	Condition,
	Hotspot,
	Instruction,
	Monster,
	Puzzle,
	Sound,
	StartupImage,
	Tile,
	Zone
} from "src/engine/objects";
import { OutputStream, add } from "src/util";
import { Yoda } from "src/variant";

import { AssetManager } from "src/engine";

class AssetManagerSerializer {
	public serialize(assets: AssetManager, stream: OutputStream): void {
		this.writeVersion(assets, stream);
		this.writeStartupImage(assets, stream);
		this.writeSounds(assets, stream);
		this.writeTiles(assets, stream);
		this.writeZones(assets, stream);
		this.writePuzzles(assets, stream);
		this.writeCharacters(assets, stream);
		this.writeCharacterWeapons(assets, stream);
		this.writeCharacterAuxiliary(assets, stream);
		this.writeTileNames(assets, stream);
		this.writeEndOfFile(stream);
	}

	private writeVersion(_: AssetManager, stream: OutputStream) {
		stream.writeCharacters("VERS");
		stream.writeUint32(512);
	}

	private writeStartupImage(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("STUP");
		stream.writeUint32(288 * 288);
		stream.writeUint8Array(assets.get(Uint8Array, StartupImage));
	}

	private writeSounds(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("SNDS");
		const size = assets
			.getAll(Sound)
			.map((snd: Sound) => 2 + snd.file.length + 1)
			.reduce(add, 0);
		stream.writeUint32(2 + size);
		stream.writeUint16(-assets.getAll(Sound).length);

		assets
			.getAll(Sound)
			.forEach((snd: Sound) => stream.writeLengthPrefixedNullTerminatedString(snd.file));
	}

	private writeTiles(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("TILE");
		stream.writeUint32(assets.getAll(Tile).length * (32 * 32 + 4));
		assets.getAll(Tile).forEach((tile: Tile) => {
			stream.writeUint32(tile.attributes);
			stream.writeUint8Array(tile.imageData);
		});
	}

	private writeZones(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("ZONE");
		stream.writeUint16(assets.getAll(Zone).length);

		assets.getAll(Zone).forEach((zone: Zone, index: number) => {
			const izaxSize =
				8 +
				2 +
				2 +
				zone.monsters.length * 44 +
				2 +
				2 * zone.requiredItems.length +
				2 +
				2 * zone.goalItems.length;
			const izx2Size = 8 + 2 + 2 * zone.providedItems.length;
			const izx3Size = 8 + 2 + 2 * zone.npcs.length;
			const izx4Size = 2;
			const calculateActionSize = (action: Action) =>
				action.conditions
					.map((condition: Condition) => 0xe + condition.text.length)
					.reduce(add, 2) +
				action.instructions
					.map((instruction: Instruction) => 0xe + instruction.text.length)
					.reduce(add, 2);
			const izonSize = 20 + zone.size.height * zone.size.width * Zone.LAYERS * 2;
			const hotspotSize = zone.hotspots.length * 0xc;
			const actionSize =
				zone.actions.map(calculateActionSize).reduce(add, 0) + 8 * zone.actions.length;
			const size =
				izonSize + izaxSize + izx2Size + izx3Size + izx4Size + hotspotSize + actionSize + 14;

			stream.writeUint16(zone.planet.rawValue);

			stream.writeUint32(size);
			stream.writeUint16(index);

			stream.writeCharacters("IZON");
			stream.writeUint32(izonSize);
			stream.writeUint16(zone.size.width);
			stream.writeUint16(zone.size.height);
			stream.writeUint32(zone.type.rawValue);
			stream.writeInt16(-1);
			stream.writeUint16(zone.planet.rawValue);
			for (let y = 0; y < zone.size.height; y++) {
				for (let x = 0; x < zone.size.width; x++) {
					for (let l = 0; l < Zone.LAYERS; l++) {
						const tile = zone.getTile(x, y, l);
						if (!tile) stream.writeUint16(-1);
						else stream.writeUint16(tile.id);
					}
				}
			}

			stream.writeUint16(zone.hotspots.length);
			zone.hotspots.forEach((hotspot: Hotspot) => {
				stream.writeUint32(hotspot.type.rawValue);
				stream.writeUint16(hotspot.x);
				stream.writeUint16(hotspot.y);
				stream.writeUint16(1); // hotspot.enabled ? 1 : 0
				stream.writeInt16(hotspot.argument);
			});

			stream.writeCharacters("IZAX");
			stream.writeUint32(izaxSize);
			stream.writeUint16(zone.izaxUnknown);

			stream.writeUint16(zone.monsters.length);
			zone.monsters.forEach((monster: Monster) => {
				const path = new Int32Array(8);
				for (let i = 0; i < monster.waypoints.length; i++) {
					const waypoint = monster.waypoints[i];
					path[2 * i + 0] = waypoint.x;
					path[2 * i + 1] = waypoint.y;
				}
				for (let i = monster.waypoints.length; i < 4; i++) {
					path[2 * i + 0] = -1;
					path[2 * i + 1] = -1;
				}

				stream.writeUint16(monster.face.id);
				stream.writeUint16(monster.position.x);
				stream.writeUint16(monster.position.y);
				stream.writeInt16(monster.loot);
				stream.writeInt32(+monster.dropsLoot);
				stream.writeInt32Array(path);
			});

			stream.writeUint16(zone.requiredItems.length);
			stream.writeUint16Array(zone.requiredItems.map(i => i.id));
			stream.writeUint16(zone.goalItems.length);
			stream.writeUint16Array(zone.goalItems.map(i => i.id));

			stream.writeCharacters("IZX2");
			stream.writeUint32(izx2Size);
			stream.writeUint16(zone.providedItems.length);
			stream.writeUint16Array(zone.providedItems.map(i => i.id));

			stream.writeCharacters("IZX3");
			stream.writeUint32(izx3Size);
			stream.writeUint16(zone.npcs.length);
			stream.writeUint16Array(zone.npcs.map(i => i.id));

			stream.writeCharacters("IZX4");
			stream.writeUint32(izx4Size);
			stream.writeUint16(zone.izx4Unknown);

			stream.writeUint16(zone.actions.length);

			zone.actions.forEach((action: Action) => {
				stream.writeCharacters("IACT");
				stream.writeUint32(calculateActionSize(action));

				stream.writeUint16(action.conditions.length);
				action.conditions.forEach((condition: Condition) => {
					stream.writeUint16(condition.opcode);
					stream.writeInt16Array(Array.from(condition.arguments).padEnd(5, 0));
					stream.writeLengthPrefixedString(condition.text);
				});

				stream.writeUint16(action.instructions.length);
				action.instructions.forEach((instruction: Instruction) => {
					stream.writeUint16(instruction.opcode);
					stream.writeInt16Array(Array.from(instruction.arguments).padEnd(5, 0));
					stream.writeLengthPrefixedString(instruction.text);
				});
			});
		});
	}

	private writePuzzles(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("PUZ2");
		stream.writeUint32(
			assets.getAll(Puzzle).length * 28 +
				assets
					.getAll(Puzzle)
					.map((p: Puzzle) => p.strings.map(p => 2 + p.length).reduce(add, 0))
					.reduce(add, 0) +
				2
		);

		assets.getAll(Puzzle).forEach((puzzle: Puzzle, index: number) => {
			stream.writeUint16(index);
			stream.writeCharacters("IPUZ");
			stream.writeUint32(18 + puzzle.strings.map(s => 2 + s.length).reduce(add, 0));

			if (index === Yoda.goalIDs.RESCUE_YODA || index === Yoda.goalIDs.CAR) {
				stream.writeUint32(Puzzle.Type.Mission.rawValue);
			} else stream.writeUint32(puzzle.type.rawValue);

			stream.writeUint32(puzzle.item1Class.rawValue);
			stream.writeUint32(puzzle.item2Class.rawValue);
			stream.writeUint16(puzzle.unknown3);

			puzzle.strings.forEach(string => {
				stream.writeLengthPrefixedString(string);
			});
			stream.writeUint16(puzzle.item1?.id ?? -1);
			stream.writeUint16(puzzle.item2?.id ?? -1);
		});

		stream.writeUint16(-1);
	}

	private writeCharacters(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("CHAR");
		stream.writeUint32(2 + assets.getAll(Character).length * (10 + 26 + 3 * 2 * 8));

		assets.getAll(Character).forEach((c: Character, index: number) => {
			stream.writeUint16(index);
			stream.writeCharacters("ICHA");
			stream.writeUint32(26 + c.frames.length * 2 * 8);
			stream.writeNullTerminatedString(c.name.padEnd(15, "\0"));
			stream.writeUint16(c.type.rawValue);
			stream.writeUint16(c.movementType.rawValue);
			stream.writeUint16(c.probablyGarbage1);
			stream.writeUint32(c.probablyGarbage2);

			c.frames.forEach(frame => {
				stream.writeUint16Array(frame.tiles.map(t => (t ? t.id : -1)));
			});
		});
		stream.writeUint16(-1);
	}

	private writeCharacterWeapons(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("CHWP");
		stream.writeUint32(assets.getAll(Character).length * 6 + 2);

		assets.getAll(Character).forEach((c: Character, index: number) => {
			stream.writeUint16(index);
			stream.writeUint16(c.reference);
			stream.writeUint16(c.health);
		});
		stream.writeUint16(-1);
	}

	private writeCharacterAuxiliary(assets: AssetManager, stream: OutputStream) {
		stream.writeCharacters("CAUX");
		stream.writeUint32(assets.getAll(Character).length * 4 + 2);

		assets.getAll(Character).forEach((c: Character, index: number) => {
			stream.writeUint16(index);
			stream.writeUint16(c.damage);
		});
		stream.writeUint16(-1);
	}

	private writeTileNames(assets: AssetManager, stream: OutputStream) {
		const namedTiles = assets.getFiltered(Tile, t => !!t.name);

		stream.writeCharacters("TNAM");
		stream.writeUint32(namedTiles.length * 0x1a + 2);

		namedTiles.forEach((tile: Tile) => {
			stream.writeUint16(tile.id);
			stream.writeCharacters(tile.name.padEnd(0x18, "\0"));
		});
		stream.writeUint16(-1);
	}

	private writeEndOfFile(stream: OutputStream) {
		stream.writeCharacters("ENDF");
		stream.writeUint32(0);
	}
}

export default AssetManagerSerializer;
