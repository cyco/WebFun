import { GameData } from "src/engine";
import { Tile } from "src/engine/objects";
import { ReferencesTo } from "src/app/editor/reference";
import { equal } from "src/util/functional";
import ResolverInterface from "./resolver-interface";

class TileResolver implements ResolverInterface<Tile> {
	private data: GameData;
	constructor(data: GameData) {
		this.data = data;
	}

	public resolve(needle: Tile, op = equal): ReferencesTo<Tile> {
		const result: ReferencesTo<Tile> = [];

		return result;
	}
}

export default TileResolver;
