import { AssetManager } from "src/engine";
import { Char, Zone } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class CharResolver implements ResolverInterface<Char> {
	private _assets: AssetManager;

	constructor(assets: AssetManager) {
		this._assets = assets;
	}

	public resolve(needle: Char, op = equal): ReferencesTo<Char> {
		const result: ReferencesTo<Char> = [];

		for (const character of this._assets.getAll(Char)) {
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
