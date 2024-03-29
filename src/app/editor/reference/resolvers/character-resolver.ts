import { AssetManager } from "src/engine";
import { Character, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class CharResolver implements ResolverInterface<Character> {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public resolve(needle: Character, op = equal): ReferencesTo<Character> {
		const result: ReferencesTo<Character> = [];

		for (const character of this._assets.getAll(Character)) {
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

		for (const zone of this._assets.getAll(Zone)) {
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
