import { Zone } from "src/engine/objects";

import { SearchDelegate } from "src/ui/components/list";

class ZoneFilter implements SearchDelegate<Zone, RegExp[]> {
	private _cache: { [_: number]: string } = {};

	prepareListSearch(searchValue: string): RegExp[] {
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], tile: Zone): boolean {
		if (!tile) return true;

		const string = this._stringForZone(tile);
		return searchValue.every(r => r.test(string));
	}

	private _stringForZone(zone: Zone): string {
		const cachedValue = this._cache[zone.id];
		if (cachedValue) return cachedValue;

		const components: string[] = [
			zone.name,
			`${zone.id}`,
			zone.type.name,
			zone.planet.name,
			zone.hasTeleporter ? "teleporter" : "",
			...zone.puzzleNPCs.map(tile => tile.name),
			...zone.requiredItems.map(tile => tile.name),
			...zone.providedItems.map(tile => tile.name),
			...zone.goalItems.map(tile => tile.name),
			...zone.actions.map(actn => actn.name)
		];

		return (this._cache[zone.id] = components.unique().join(" "));
	}
}

export default ZoneFilter;
