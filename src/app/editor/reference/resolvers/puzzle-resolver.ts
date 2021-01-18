import { GameData } from "src/engine";
import { Puzzle } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class PuzzleResolver implements ResolverInterface<Puzzle> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Puzzle, op = equal): ReferencesTo<Puzzle> {
		const result: ReferencesTo<Puzzle> = [];

		return result;
	}
}

export default PuzzleResolver;
