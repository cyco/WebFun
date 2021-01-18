import { GameData } from "src/engine";
import { Char } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class CharResolver implements ResolverInterface<Char> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Char, op = equal): ReferencesTo<Char> {
		const result: ReferencesTo<Char> = [];

		for (const character of this.data.characters) {
			if (op(character.id, needle.id)) {
				result.push({ from: character, to: character, via: ["id"] });
			}

			if (
				!character.isWeapon() &&
				character.reference !== -1 &&
				op(character.reference, needle.id)
			) {
				result.push({ from: character, to: needle, via: ["weapon"] });
			}
		}

		for (const zone of this.data.zones) {
			for (const monster of zone.monsters) {
				if (op(monster.face.id, needle.id)) {
					result.push({ from: monster, to: needle, via: [zone] });
				}
			}
		}

		return result;
	}
}

export default CharResolver;
