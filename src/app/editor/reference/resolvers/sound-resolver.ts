import { GameData } from "src/engine";
import { Sound, Char } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";
import PlaySound from "src/engine/script/instructions/play-sound";
import StopSound from "src/engine/script/instructions/stop-sound";

class SoundResolver implements ResolverInterface<Sound> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Sound, op = equal): ReferencesTo<Sound> {
		const result: ReferencesTo<Sound> = [];

		for (const sound of this.data.sounds) {
			if (op(sound.id, needle.id)) {
				result.push({ from: sound, to: sound, via: ["id"] });
			}
		}

		for (const zone of this.data.zones) {
			for (const action of zone.actions) {
				for (const instruction of action.instructions) {
					if (
						instruction.opcode === PlaySound.Opcode &&
						instruction.arguments[0] !== -1 &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action] });
					}

					if (
						instruction.opcode === StopSound.Opcode &&
						instruction.arguments[0] !== -1 &&
						op(instruction.arguments[0], needle.id)
					) {
						result.push({ from: instruction, to: needle, via: [zone, action] });
					}
				}
			}
		}

		for (const character of this.data.characters) {
			if (
				character.type === Char.Type.Weapon &&
				character.reference !== -1 &&
				op(character.reference, needle.id)
			) {
				result.push({ from: character, to: needle, via: [] });
			}
		}

		return result;
	}
}

export default SoundResolver;
