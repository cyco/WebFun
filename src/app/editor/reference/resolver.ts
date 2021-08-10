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
import { AssetManager } from "src/engine";

class Resolver {
	private resolvers: Map<any, any> = new Map();

	constructor(assets: AssetManager) {
		this.resolvers.set(Zone, new ZoneResolver(assets));
		this.resolvers.set(Hotspot, new HotspotResolver(assets));
		this.resolvers.set(Monster, new MonsterResolver(assets));
		this.resolvers.set(Sound, new SoundResolver(assets));
		this.resolvers.set(Tile, new TileResolver(assets));
		this.resolvers.set(Char, new CharResolver(assets));
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
