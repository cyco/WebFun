import GameData from "src/engine/game-data";
import HotspotResolver from "./resolvers/hotspot-resolver";
import ZoneResolver from "./resolvers/zone-resolver";
import { Resolvable, ReferencesTo } from "./reference";
import { Zone, Hotspot } from "src/engine/objects";
import { equal } from "src/util/functional";

class Resolver {
	private data: GameData;
	constructor(gameData: GameData) {
		this.data = gameData;
	}

	public find<T extends Resolvable>(thing: T, op = equal): ReferencesTo<T> {
		if (thing instanceof Zone) {
			const resolver = new ZoneResolver(this.data);
			resolver.resolve((thing as unknown) as Zone, equal);
		}

		if (thing instanceof Hotspot) {
			const resolver = new HotspotResolver(this.data);
			return resolver.resolve(thing, op) as ReferencesTo<T>;
		}

		return [];
	}
}
export default Resolver;
