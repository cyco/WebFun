import { GameData } from "src/engine";
import { add, OutputStream } from "src/util";
import Tile from "src/engine/objects/tile";
import Zone from "src/engine/objects/zone";
import Hotspot from "src/engine/objects/hotspot";
import Action from "src/engine/objects/action";
import Condition from "src/engine/objects/condition";
import Instruction from "src/engine/objects/instruction";
import NPC from "src/engine/objects/npc";
import Puzzle from "src/engine/objects/puzzle";
import PuzzleType from "src/engine/objects/puzzle-type";
import Char from "src/engine/objects/char";

class GameDataSerializer {
	public serialize(data: GameData, stream: OutputStream): void {

		this.writeVersion(data, stream);
		this.writeSetupImage(data, stream);
		this.writeSounds(data, stream);
		this.writeTiles(data, stream);
		this.writeZones(data, stream);
		this.writePuzzles(data, stream);
		this.writeCharacters(data, stream);
		this.writeCharacterWeapons(data, stream);
		this.writeCharacterAuxiliary(data, stream);
		this.writeTileNames(data, stream);
		this.writeEndOfFile(data, stream);
	}

	private writeVersion(data: GameData, stream: OutputStream) {
		stream.writeCharacters("VERS");
		stream.writeUint32(512);
	}

	private writeSetupImage(data: GameData, stream: OutputStream) {
		stream.writeCharacters("STUP");
		stream.writeUint32(288 * 288);
		stream.writeUint8Array(data.setupImageData);
	}

	private writeSounds(data: GameData, stream: OutputStream) {
		stream.writeCharacters("SNDS");
		const size = data.sounds.map((snd: string) => 2 + snd.length + 1).reduce(add, 0);
		stream.writeUint32(2 + size);
		stream.writeUint16(-data.sounds.length);

		data.sounds.forEach((snd: string) => stream.writeLengthPrefixedNullTerminatedString(snd));
	}

	private writeTiles(data: GameData, stream: OutputStream) {
		stream.writeCharacters("TILE");
		stream.writeUint32(data.tiles.length * (32 * 32 + 4));

		data.tiles.forEach((tile: Tile) => {
			stream.writeUint32(tile.attributes);
			stream.writeUint8Array(tile.pixelData);
		});
	}

	private writeZones(data: GameData, stream: OutputStream) {
		stream.writeCharacters("ZONE");
		stream.writeUint16(data.zones.length);

		data.zones.forEach((zone: Zone, index: number) => {
			const izaxSize = 8 + 2 + 2 + zone.npcs.length * 44 + 2 + 2 * zone.requiredItemIDs.length + 2 + 2 * zone.assignedItemIDs.length;
			const izx2Size = 8 + 2 + 2 * zone.providedItemIDs.length;
			const izx3Size = 8 + 2 + 2 * zone.puzzleNPCTileIDs.length;
			const izx4Size = 2;
			const calculateActionSize = (action: Action) => action.conditions.map((condition: Condition) => 0xE + condition.text.length).reduce(add, 2) + action.instructions.map((condition: Condition) => 0xE + condition.text.length).reduce(add, 2);
			const izonSize = 20 + zone.height * zone.width * Zone.LAYERS * 2;
			const hotspotSize = zone.hotspots.length * 0xC;
			const actionSize = zone.actions.map(calculateActionSize).reduce(add, 0) + 8 * zone.actions.length;
			const size = izonSize + izaxSize + izx2Size + izx3Size + izx4Size + hotspotSize + actionSize + 14;

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

			for (let y = 0; y < zone.height; y++) {
				for (let x = 0; x < zone.width; x++) {
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
				stream.writeUint16(hotspot.enabled ? 1 : 1);
				stream.writeInt16(hotspot.arg);
			});

			stream.writeCharacters("IZAX");
			stream.writeUint32(izaxSize);
			stream.writeUint16(zone.izaxUnknown);

			stream.writeUint16(zone.npcs.length);
			zone.npcs.forEach((npc: NPC) => {
				stream.writeUint16(npc.face);
				stream.writeUint16(npc.x);
				stream.writeUint16(npc.y);
				stream.writeUint16(npc.unknown1);
				stream.writeUint32(npc.unknown2);
				stream.writeUint8Array(npc.unknown3);
			});

			stream.writeUint16(zone.requiredItemIDs.length);
			stream.writeUint16Array(zone.requiredItemIDs.map(i => i.id)); // TODO: use tile objects instead
			stream.writeUint16(zone.assignedItemIDs.length);
			stream.writeUint16Array(zone.assignedItemIDs.map(i => i.id)); // TODO: use tile objects instead

			stream.writeCharacters("IZX2");
			stream.writeUint32(izx2Size);
			stream.writeUint16(zone.providedItemIDs.length);
			stream.writeUint16Array(zone.providedItemIDs.map(i => i.id)); // TODO: use tile objects instead

			stream.writeCharacters("IZX3");
			stream.writeUint32(izx3Size);
			stream.writeUint16(zone.puzzleNPCTileIDs.length);
			stream.writeUint16Array(zone.puzzleNPCTileIDs.map(i => i.id)); // TODO: use tile objects instead

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
					stream.writeUint16Array(condition.arguments);
					stream.writeLengthPrefixedString(condition.text);
				});

				stream.writeUint16(action.instructions.length);
				action.instructions.forEach((instruction: Instruction) => {
					stream.writeUint16(instruction.opcode);
					stream.writeUint16Array(instruction.arguments);
					stream.writeLengthPrefixedString(instruction.text);
				});
			});
		});
	}

	private writePuzzles(data: GameData, stream: OutputStream) {
		stream.writeCharacters("PUZ2");
		stream.writeUint32(data.puzzles.length * 28 + data.puzzles.map((p: Puzzle) => p.strings.map(p => 2 + p.length).reduce(add, 0)).reduce(add, 0) + 2);

		data.puzzles.forEach((puzzle: Puzzle, index: number) => {
			stream.writeUint16(index);
			stream.writeCharacters("IPUZ");
			stream.writeUint32(18 + puzzle.strings.map(s => 2 + s.length).reduce(add, 0));

			if (index === 0xBD || index === 0xC5) {
				stream.writeUint32(PuzzleType.End.rawValue);
			} else stream.writeUint32(puzzle.type.rawValue);

			stream.writeUint32(puzzle._unknown1);
			stream.writeUint32(puzzle._unknown2);
			stream.writeUint16(puzzle._unknown3);

			puzzle.strings.forEach((string) => {
				stream.writeLengthPrefixedString(string);
			});
			stream.writeUint16(puzzle.item_1.id);
			stream.writeUint16(puzzle.item_2 ? puzzle.item_2.id : -1);
		});

		stream.writeUint16(-1);
	}

	private writeCharacters(data: GameData, stream: OutputStream) {
		stream.writeCharacters("CHAR");
		stream.writeUint32(2 + data.characters.length * (10 + 26 + 3 * 2 * 8)); // TODO

		data.characters.forEach((c: Char, index: number) => {
			stream.writeUint16(index);
			stream.writeCharacters("ICHA");
			stream.writeUint32(26 + c.frames.length * 2 * 8);
			stream.writeNullTerminatedString(c.name.padEnd(15, "\0"));
			stream.writeUint16(c.type);
			stream.writeUint16(c._movementType);
			stream.writeUint16(c._garbage1);
			stream.writeUint32(c._garbage2);

			c.frames.forEach(frame => {
				stream.writeUint16Array(frame.tiles.map(t => t ? t.id : -1));
			});
		});
		stream.writeUint16(-1);
	}

	private writeCharacterWeapons(data: GameData, stream: OutputStream) {
		stream.writeCharacters("CHWP");
		stream.writeUint32(data.characters.length * 6 + 2); // TODO

		data.characters.forEach((c: Char, index: number) => {
			stream.writeUint16(index);
			stream.writeUint16(c.reference);
			stream.writeUint16(c.health);
		});
		stream.writeUint16(-1);
	}

	private writeCharacterAuxiliary(data: GameData, stream: OutputStream) {
		stream.writeCharacters("CAUX");
		stream.writeUint32(data.characters.length * 4 + 2); // TODO

		data.characters.forEach((c: Char, index: number) => {
			stream.writeUint16(index);
			stream.writeUint16(c.damage);
		});
		stream.writeUint16(-1);
	}

	private writeTileNames(data: GameData, stream: OutputStream) {
		const namedTiles = data.tiles.filter((t: Tile) => t.name);

		stream.writeCharacters("TNAM");
		stream.writeUint32(namedTiles.length * 0x1A + 2);

		namedTiles.forEach((tile: Tile) => {
			stream.writeUint16(tile.id);
			stream.writeCharacters(tile.name.padEnd(0x18, "\0"));
		});
		stream.writeUint16(-1);
	}

	private writeEndOfFile(data: GameData, stream: OutputStream) {
		stream.writeCharacters("ENDF");
		stream.writeUint32(0);
	}
}

export default GameDataSerializer;
