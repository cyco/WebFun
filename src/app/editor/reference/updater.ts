import { Zone, Hotspot, Monster, Sound, Tile, Char, Action } from "src/engine/objects";
import GameData from "src/engine/game-data";
import ReferenceResolver from "./resolver";
import { greaterThan } from "src/util/functional";
import { Reference, Resolvable } from "./reference";
import { Yoda } from "src/engine/type";
import { MutableChar, MutableTile, MutableZone } from "src/engine/mutable-objects";
import { Size } from "src/util";
import { Planet } from "src/engine/types";

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
		outdatedReferences.forEach(r => this.updateReferences(r, this.determineUpdater(r)));

		if (thing instanceof Zone) {
			this.data.zones.sort(({ id: a }, { id: b }) => a - b);
			for (let i = 0; i < this.data.zones.length; i++) {
				if (this.data.zones[i].id !== i) {
					const zone = new MutableZone();
					zone.id = i;
					zone.planet = Planet.None;
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

	private determineUpdater(r: Reference) {
		const protectedZones = Object.values(Yoda.zoneIDs).filter(i => typeof i === "number");
		const protectedTiles = Object.values(Yoda.tileIDs).filter(i => typeof i === "number");

		if (r.to instanceof Zone) {
			return (id: number) => {
				if (protectedZones.contains(id)) return id;

				let result = id - 1;
				while (protectedZones.contains(result)) result -= 1;
				return result;
			};
		}

		if (r.to instanceof Tile) {
			return (id: number) => {
				if (protectedTiles.contains(id)) return id;

				let result = id - 1;
				while (protectedTiles.contains(result)) result -= 1;
				return result;
			};
		}

		return (id: number) => id - 1;
	}

	private deleteReference(ref: Reference) {
		if (ref.via[0] === "id") {
			return;
		}

		if ("isCondition" in ref.from && ref.via[1] instanceof Action) {
			this.removeItemFrom(ref.from, ref.via[1].conditions);
			return;
		}

		if ("isInstruction" in ref.from && ref.via[1] instanceof Action) {
			this.removeItemFrom(ref.from, ref.via[1].instructions);
			return;
		}

		if (ref.to instanceof Zone && ref.from instanceof Hotspot) {
			this.deleteItem(ref.from);
			return;
		}

		if (ref.to instanceof Hotspot && ref.from instanceof Zone) {
			this.removeItemFrom(ref.to, ref.from.hotspots);
			return;
		}

		if (ref.to instanceof Monster && ref.from instanceof Zone) {
			this.removeItemFrom(ref.to, ref.from.monsters);
			return;
		}

		if (ref.to instanceof Sound && ref.from instanceof Char) {
			(ref.from as MutableChar).reference = -1;
			return;
		}

		if (ref.to instanceof Char && ref.from instanceof Char && ref.via[0] === "weapon") {
			(ref.from as MutableChar).reference = -1;
			return;
		}

		if (ref.to instanceof Char && ref.from instanceof Monster) {
			ref.from.face = null;
			return;
		}

		console.assert(false, "Don't know how to clear reference", ref);
	}

	private removeItemFrom<T>(item: T, array: T[]) {
		const index = array.indexOf(item);
		console.assert(index >= 0);
		array.splice(index, 1);
	}

	private updateReferences(reference: Reference, update: (_: number) => number): void {
		if ("isInstruction" in reference.from) {
			const argpos = reference.via[2];
			reference.from.arguments[argpos] = update(reference.from.arguments[argpos]);
			return;
		}

		if ("isCondition" in reference.from) {
			const argpos = reference.via[2];
			reference.from.arguments[argpos] = update(reference.from.arguments[argpos]);
			return;
		}

		if (reference.to instanceof Char && reference.from instanceof Char) {
			(reference.from as MutableChar).reference = update(reference.from.reference);
			return;
		}

		if (reference.via[0] === "id") {
			(reference.to as any).id = update(reference.to.id);
			return;
		}

		if (reference.to instanceof Zone && reference.from instanceof Hotspot) {
			reference.from.arg = update(reference.from.arg);
			return;
		}

		if (reference.to instanceof Char && reference.from instanceof Monster) {
			// Monster references should be updated automatically when the data is serialized
			return;
		}

		if (reference.from instanceof Zone && reference.to instanceof Hotspot) {
			return;
		}

		if (reference.from instanceof Zone && reference.to instanceof Monster) {
			return;
		}

		if (
			reference.from instanceof Zone &&
			reference.to instanceof Tile &&
			reference.via[0] === "tileIDs"
		) {
			reference.from.tileIDs[reference.via[1]] = update(reference.from.tileIDs[reference.via[1]]);
			return;
		}

		if (
			reference.to instanceof Tile &&
			reference.from instanceof Char &&
			typeof reference.via[0] === "number" &&
			typeof reference.via[1] === "number"
		) {
			reference.from.frames[reference.via[0]].tiles[reference.via[1]] = this.data.tiles[
				update(reference.from.frames[reference.via[0]].tiles[reference.via[1]].id)
			];
			return;
		}

		console.assert(false, "Don't know how to update reference", reference);
	}
}

export default Updater;
