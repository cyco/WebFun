import { Zone, Hotspot } from "src/engine/objects";
import GameData from "src/engine/game-data";
import ReferenceResolver from "./resolver";
import { greaterThan } from "src/util/functional";
import { Reference } from "./reference";
import { Yoda } from "src/engine/type";

class Updater {
	private data: GameData;
	public constructor(data: GameData) {
		this.data = data;
	}

	public deleteItem(thing: Zone | Hotspot): void {
		const resolver = new ReferenceResolver(this.data);
		const references = resolver.find(thing);
		references.forEach(r => this.deleteReference(r));

		if (thing instanceof Zone) {
			this.removeItemFrom(thing, this.data.zones);
		}

		const outdatedReferences = resolver.find(thing, greaterThan);
		outdatedReferences.forEach(r => this.updateReferences(r, this.determineUpdater(r)));

		if (thing instanceof Zone) {
			this.data.zones.sort(({ id: a }, { id: b }) => a - b);
		}
	}

	private determineUpdater(r: Reference) {
		const protectedZones = Object.values(Yoda.zoneIDs).filter(i => typeof i === "number");
		if (r.to instanceof Zone) {
			return (id: number) => {
				if (protectedZones.contains(id)) return id;

				let result = id - 1;
				while (protectedZones.contains(result)) result -= 1;
				return result;
			};
		}

		return (id: number) => id - 1;
	}

	private deleteReference(ref: Reference) {
		if (ref.via[0] === "id") {
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

		if (ref.to instanceof Hotspot && "isInstruction" in ref.from) {
			this.removeItemFrom(ref.from, ref.via[1].instructions);
			return;
		}

		console.assert(false, `Don't know how to clear reference`);
	}

	private removeItemFrom<T>(item: T, array: T[]) {
		const index = array.indexOf(item);
		console.assert(index >= 0);
		array.splice(index, 1);
	}

	private updateReferences(reference: Reference, update: (_: number) => number): void {
		if (reference.via[0] === "id") {
			(reference.to as any).id = update(reference.to.id);
			return;
		}

		if (reference.to instanceof Zone && reference.from instanceof Hotspot) {
			reference.from.arg = update(reference.from.arg);
			return;
		}

		if (reference.to instanceof Zone && "isInstruction" in reference.from) {
			reference.from.arguments[0] = update(reference.from.arguments[0]);
			return;
		}

		if (reference.to instanceof Hotspot && "isInstruction" in reference.from) {
			reference.from.arguments[0] = update(reference.from.arguments[0]);
			return;
		}

		console.assert(false, "Don't know how to update reference");
	}
}

export default Updater;
