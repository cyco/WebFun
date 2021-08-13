import { Action, Character, Hotspot, Monster, Puzzle, Sound, Tile, Zone } from "src/engine/objects";
import ReferenceResolver from "./resolver";
import { greaterThan } from "src/util/functional";
import { Reference, Resolvable } from "./reference";
import { Yoda } from "src/variant";
import { AssetManager } from "src/engine";

class Updater {
	public constructor(private assets: AssetManager) {}

	public deleteItem(thing: Zone | Hotspot | Monster | Sound | Tile | Character): void {
		const resolver = new ReferenceResolver(this.assets);
		const references = resolver.find(thing);
		const outdatedReferences = resolver.find(thing, greaterThan);
		references.forEach(r => this.deleteReference(r));
		this.removeTopLevelReference(thing);
		outdatedReferences.forEach(r => this.updateReference(r, this.determineUpdater(r)));

		if (thing instanceof Zone) {
			this.assets.getAll(Zone).sort(({ id: a }, { id: b }) => a - b);
			for (let i = 0; i < this.assets.getAll(Zone).length; i++) {
				if (this.assets.get(Zone, i).id !== i) {
					const zone = new Zone(
						i,
						{
							planet: Zone.Planet.None.rawValue,
							zoneType: Zone.Type.None.rawValue,
							width: 9,
							height: 9,
							tileIDs: new Int16Array(9 * 9 * 3).map(_ => -1),
							providedItemIDs: new Int16Array(),
							requiredItemIDs: new Int16Array(),
							goalItemIDs: new Int16Array(),
							npcIDs: new Int16Array(),
							hotspots: [],
							actions: [],
							monsters: [],
							unknown: -1
						},
						this.assets
					);
					this.assets.getAll(Zone).splice(i, 0, zone);
				}
			}
		}

		if (thing instanceof Tile) {
			this.assets.getAll(Tile).sort(({ id: a }, { id: b }) => a - b);
			for (let i = 0; i < this.assets.getAll(Tile).length; i++) {
				if (this.assets.get(Tile, i).id !== i) {
					const tile = new Tile(i, {
						attributes: 0,
						pixels: new Uint8Array(Tile.WIDTH * Tile.HEIGHT)
					});
					this.assets.getAll(Tile).splice(i, 0, tile);
				}
			}
		}
	}

	private removeTopLevelReference(thing: Resolvable) {
		if (thing instanceof Zone) {
			this.removeItemFrom(thing, this.assets.getAll(Zone));
		}

		if (thing instanceof Tile) {
			this.removeItemFrom(thing, this.assets.getAll(Tile));
		}

		if (thing instanceof Sound) {
			this.removeItemFrom(thing, this.assets.getAll(Sound));
		}

		if (thing instanceof Character) {
			this.removeItemFrom(thing, this.assets.getAll(Character));
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

		if (to instanceof Sound && from instanceof Character) {
			(from as Character).reference = -1;
			return;
		}

		if (to instanceof Character && from instanceof Character && via[0] === "weapon") {
			(from as Character).reference = -1;
			return;
		}

		if (to instanceof Character && from instanceof Monster) {
			this.deleteItem(from);
			return;
		}

		if (to instanceof Tile && from instanceof Hotspot) {
			this.deleteItem(from);
			return;
		}

		if (to instanceof Tile && from instanceof Puzzle) {
			if (via[0] === "item1") (from as Puzzle).item1 = null;
			else (from as Puzzle).item2 = null;

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

		if (to instanceof Character && from instanceof Character && via[0] === "weapon") {
			(from as Character).reference = update(from.reference);
			return;
		}

		if (via[0] === "id") {
			to.id = update(to.id);
			return;
		}

		if (to instanceof Zone && from instanceof Hotspot) {
			from.arg = update(from.arg);
			return;
		}

		if (to instanceof Character && from instanceof Monster) {
			// Monster references should be updated automatically when the.assets.is serialized
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
			from instanceof Character &&
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
