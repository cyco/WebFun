import GameData from "src/engine/game-data";
import HotspotResolver from "./resolvers/hotspot-resolver";
import ZoneResolver from "./resolvers/zone-resolver";
import { Resolvable, ReferencesTo } from "./reference";
import { Zone, Hotspot, Action, Tile, Char, Sound } from "src/engine/objects";
import { equal } from "src/util/functional";

class Resolver {
	private data: GameData;
	private resolvers: Map<any, any> = new Map();

	constructor(data: GameData) {
		this.data = data;

		this.resolvers.set(Zone, new ZoneResolver(data));
		this.resolvers.set(Hotspot, new HotspotResolver(data));
	}

	public find<T extends Resolvable>(thing: T, op = equal): ReferencesTo<T> {
		const resolver = this.determineResolver(thing);
		if (!resolver) return [];

		return resolver.resolve(thing, op);
	}

	private determineResolver(thing: Resolvable) {
		const classes = [Zone, Action, Tile, Hotspot, Char, Sound];
		const resolvableClass = classes.find(c => thing instanceof c);
		return this.resolvers.get(resolvableClass);
	}
}

export default Resolver;
