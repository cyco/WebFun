import GameData from "src/engine/game-data";
import { ReferencesTo, Resolvable } from "./reference";
import { Char, Hotspot, Monster, Sound, Tile, Zone } from "src/engine/objects";
import { equal } from "src/util/functional";
import {
	CharResolver,
	HotspotResolver,
	MonsterResolver,
	SoundResolver,
	TileResolver,
	ZoneResolver
} from "./resolvers";

class Resolver {
	private resolvers: Map<any, any> = new Map();

	constructor(data: GameData) {
		this.resolvers.set(Zone, new ZoneResolver(data));
		this.resolvers.set(Hotspot, new HotspotResolver(data));
		this.resolvers.set(Monster, new MonsterResolver(data));
		this.resolvers.set(Sound, new SoundResolver(data));
		this.resolvers.set(Tile, new TileResolver(data));
		this.resolvers.set(Char, new CharResolver(data));
	}

	public find<T extends Resolvable>(thing: T, op = equal): ReferencesTo<T> {
		const resolver = this.determineResolver(thing);
		if (!resolver) return [];

		return resolver.resolve(thing, op);
	}

	private determineResolver(thing: Resolvable) {
		const classes = [Zone, Tile, Hotspot, Char, Sound, Monster];
		const resolvableClass = classes.find(c => thing instanceof c);
		return this.resolvers.get(resolvableClass);
	}
}

export default Resolver;
