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

		return result;
	}
}

export default CharResolver;
