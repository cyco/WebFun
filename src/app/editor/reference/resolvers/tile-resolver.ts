import { GameData } from "src/engine";
import { Tile, Hotspot } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";
import { ConditionsByName as C } from "src/engine/script/conditions";
import { InstructionsByName as I } from "src/engine/script/instructions";

class TileResolver implements ResolverInterface<Tile> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Tile, op = equal): ReferencesTo<Tile> {
		const result: ReferencesTo<Tile> = [];

		for (const tile of this.data.tiles) {
			if (op(tile.id, needle.id)) {
				result.push({ from: tile, to: tile, via: ["id"] });
			}
		}

		for (const zone of this.data.zones) {
			for (const tile of zone.requiredItems) {
				if (op(tile.id, needle.id)) {
					result.push({ from: zone, to: needle, via: ["requiredItems"] });
				}
			}

			for (const tile of zone.providedItems) {
				if (op(tile.id, needle.id)) {
					result.push({ from: zone, to: needle, via: ["providedItems"] });
				}
			}

			for (const tile of zone.goalItems) {
				if (op(tile.id, needle.id)) {
					result.push({ from: zone, to: needle, via: ["goalItems"] });
				}
			}

			for (const tile of zone.npcs) {
				if (op(tile.id, needle.id)) {
					result.push({ from: zone, to: needle, via: ["npcs"] });
				}
			}

			for (let i = 0; i < zone.tileIDs.length; i++) {
				if (op(zone.tileIDs[i], needle.id)) {
					result.push({ from: zone, to: needle, via: ["tileIDs", i] });
				}
			}

			for (const hotspot of zone.hotspots) {
				const types = [
					Hotspot.Type.DropItem,
					Hotspot.Type.DropQuestItem,
					Hotspot.Type.DropUniqueWeapon,
					Hotspot.Type.DropMap
				];
				if (types.includes(hotspot.type) && hotspot.arg !== -1 && op(hotspot.arg, needle.id)) {
					result.push({ from: hotspot, to: needle, via: [zone] });
				}
			}

			for (const action of zone.actions) {
				for (const condition of action.conditions) {
					const opcodes = [
						[C.Bump.Opcode, 2],
						[C.FindItemIs.Opcode, 0],
						[C.HasItem.Opcode, 0],
						[C.PlacedItemIs.Opcode, 3],
						[C.PlacedItemIs.Opcode, 4],
						[C.PlacedItemIsNot.Opcode, 3],
						[C.PlacedItemIsNot.Opcode, 4],
						[C.StandingOn.Opcode, 2],
						[C.TileAtIs.Opcode, 0]
					];

					for (const [opcode, argpos] of opcodes) {
						if (
							condition.opcode === opcode &&
							condition.arguments[argpos] !== -1 &&
							op(condition.arguments[argpos], needle.id)
						) {
							result.push({ from: condition, to: needle, via: [zone, action, argpos] });
						}
					}
				}
				for (const instruction of action.instructions) {
					const opcodes = [
						[I.AddItem.Opcode, 0],
						[I.DropItem.Opcode, 0],
						[I.PlaceTile.Opcode, 3],
						[I.RemoveItem.Opcode, 0]
					];

					for (const [opcode, argpos] of opcodes) {
						if (
							instruction.opcode === opcode &&
							instruction.arguments[argpos] !== -1 &&
							op(instruction.arguments[argpos], needle.id)
						) {
							result.push({ from: instruction, to: needle, via: [zone, action, argpos] });
						}
					}
				}
			}
		}

		for (const character of this.data.characters) {
			for (let i = 0; i < character.frames.length; i++) {
				const frame = character.frames[i];
				for (let j = 0; j < frame.tiles.length; j++) {
					const tile = frame.tiles[i];
					if (tile && op(tile.id, needle.id)) {
						result.push({ from: character, to: needle, via: [i, j] });
					}
				}
			}
		}

		for (const puzzle of this.data.puzzles) {
			if (puzzle.item1 && op(puzzle.item1.id, needle.id)) {
				result.push({ from: puzzle, to: needle, via: ["item1"] });
			}

			if (puzzle.item2 && op(puzzle.item2.id, needle.id)) {
				result.push({ from: puzzle, to: needle, via: ["item2"] });
			}
		}

		return result;
	}
}

export default TileResolver;
