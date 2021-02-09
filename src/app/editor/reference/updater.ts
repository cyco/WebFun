import { Zone, Hotspot, Monster, Sound, Tile, Char, Action, Puzzle } from "src/engine/objects";
import GameData from "src/engine/game-data";
import ReferenceResolver from "./resolver";
import { greaterThan } from "src/util/functional";
import { Reference, Resolvable } from "./reference";
import { Yoda } from "src/engine/variant";
import { MutableChar, MutablePuzzle, MutableTile, MutableZone } from "src/engine/mutable-objects";
import { Size } from "src/util";

class Updater {
	private data: GameData;
	public constructor(data: GameData) {
		this.data = data;
	}

	public deleteItem(thing: Zone | Hotspot | Monster | Sound | Tile | Char): void {
		const resolver = new ReferenceResolver(this.data);
		const references = resolver.find(thing);
		const outdatedReferences = resolver.find(thing, greaterThan);
		references.forEach(r => this.deleteReference(r));
		this.removeTopLevelReference(thing);
		outdatedReferences.forEach(r => this.updateReference(r, this.determineUpdater(r)));

		if (thing instanceof Zone) {
			this.data.zones.sort(({ id: a }, { id: b }) => a - b);
			for (let i = 0; i < this.data.zones.length; i++) {
				if (this.data.zones[i].id !== i) {
					const zone = new MutableZone();
					zone.id = i;
					zone.planet = Zone.Planet.None;
					zone.type = Zone.Type.None;
					zone.size = new Size(9, 9);
					zone.tileIDs = new Int16Array(zone.size.area * 3);
					zone.tileIDs = zone.tileIDs.map(_ => -1);
					this.data.zones.splice(i, 0, zone);
				}
			}
		}

		if (thing instanceof Tile) {
			this.data.tiles.sort(({ id: a }, { id: b }) => a - b);
			for (let i = 0; i < this.data.tiles.length; i++) {
				if (this.data.tiles[i].id !== i) {
					const tile = new MutableTile();
					tile.id = i;
					tile.imageData = new Uint8Array(Tile.WIDTH * Tile.HEIGHT);
					this.data.tiles.splice(i, 0, tile);
				}
			}
		}
	}

	private removeTopLevelReference(thing: Resolvable) {
		if (thing instanceof Zone) {
			this.removeItemFrom(thing, this.data.zones);
		}

		if (thing instanceof Tile) {
			this.removeItemFrom(thing, this.data.tiles);
		}

		if (thing instanceof Sound) {
			this.removeItemFrom(thing, this.data.sounds);
		}

		if (thing instanceof Char) {
			this.removeItemFrom(thing, this.data.characters);
		}
	}

	private determineUpdater(ref: Reference) {
		const { to } = ref;
		const protectedZones = Object.values(Yoda.zoneIDs).filter(i => typeof i === "number");
		const protectedTiles = Object.values(Yoda.tileIDs).filter(i => typeof i === "number");

		if (to instanceof Zone) {
			return (id: number) => {
				if (protectedZones.includes(id)) return id;

				let result = id - 1;
				while (protectedZones.includes(result)) result -= 1;
				return result;
			};
		}

		if (to instanceof Tile) {
			return (id: number) => {
				if (protectedTiles.includes(id)) return id;

				let result = id - 1;
				while (protectedTiles.includes(result)) result -= 1;
				return result;
			};
		}

		return (id: number) => id - 1;
	}

	private deleteReference(ref: Reference) {
		const { from, to, via } = ref;
		if (via[0] === "id") {
			return;
		}

		if ("isCondition" in from && via[1] instanceof Action) {
			this.removeItemFrom(from, via[1].conditions);
			return;
		}

		if ("isInstruction" in from && via[1] instanceof Action) {
			this.removeItemFrom(from, via[1].instructions);
			return;
		}

		if (to instanceof Zone && from instanceof Hotspot) {
			this.deleteItem(from);
			return;
		}

		if (to instanceof Hotspot && from instanceof Zone) {
			this.removeItemFrom(to, from.hotspots);
			return;
		}

		if (to instanceof Monster && from instanceof Zone) {
			this.removeItemFrom(to, from.monsters);
			return;
		}

		if (to instanceof Sound && from instanceof Char) {
			(from as MutableChar).reference = -1;
			return;
		}

		if (to instanceof Char && from instanceof Char && via[0] === "weapon") {
			(from as MutableChar).reference = -1;
			return;
		}

		if (to instanceof Char && from instanceof Monster) {
			this.deleteItem(from);
			return;
		}

		if (to instanceof Tile && from instanceof Hotspot) {
			this.deleteItem(from);
			return;
		}

		if (to instanceof Tile && from instanceof Puzzle) {
			if (via[0] === "item1") (from as MutablePuzzle).item1 = null;
			else (from as MutablePuzzle).item2 = null;

			return;
		}

		console.assert(false, "Don't know how to clear reference", ref);
	}

	private removeItemFrom<T>(item: T, array: T[]) {
		const index = array.indexOf(item);
		console.assert(index >= 0);
		array.splice(index, 1);
	}

	private updateReference(ref: Reference, update: (_: number) => number): void {
		const { from, to, via } = ref;
		if ("isInstruction" in from) {
			const argpos = via[2];
			from.arguments[argpos] = update(from.arguments[argpos]);
			return;
		}

		if ("isCondition" in from) {
			const argpos = via[2];
			from.arguments[argpos] = update(from.arguments[argpos]);
			return;
		}

		if (to instanceof Char && from instanceof Char && via[0] === "weapon") {
			(from as MutableChar).reference = update(from.reference);
			return;
		}

		if (via[0] === "id") {
			(to as any).id = update(to.id);
			return;
		}

		if (to instanceof Zone && from instanceof Hotspot) {
			from.arg = update(from.arg);
			return;
		}

		if (to instanceof Char && from instanceof Monster) {
			// Monster references should be updated automatically when the data is serialized
			return;
		}

		if (from instanceof Zone && to instanceof Hotspot) {
			return;
		}

		if (from instanceof Zone && to instanceof Monster) {
			return;
		}

		if (from instanceof Zone && to instanceof Tile && via[0] === "tileIDs") {
			const i = via[1];
			from.tileIDs[i] = update(from.tileIDs[i]);
			return;
		}

		if (from instanceof Zone && to instanceof Tile && via[0] === "npcs") {
			return;
		}

		if (from instanceof Zone && to instanceof Tile && via[0] === "providedItems") {
			return;
		}

		if (from instanceof Zone && to instanceof Tile && via[0] === "requiredItems") {
			return;
		}

		if (from instanceof Zone && to instanceof Tile && via[0] === "goalItems") {
			return;
		}

		if (
			to instanceof Tile &&
			from instanceof Char &&
			typeof via[0] === "number" &&
			typeof via[1] === "number"
		) {
			return;
		}

		if (to instanceof Tile && from instanceof Hotspot) {
			from.arg = update(from.arg);
			return;
		}

		if (to instanceof Tile && from instanceof Puzzle) {
			return;
		}

		console.assert(false, "Don't know how to update reference", ref);
	}
}

export default Updater;
