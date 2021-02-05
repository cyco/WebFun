import { Tile } from "src/engine/objects";

import { SearchDelegate } from "src/ui/components/list";

class TileFilter implements SearchDelegate<Tile, RegExp[]> {
	private _cache: { [_: number]: string } = {};

	prepareListSearch(searchValue: string): RegExp[] {
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], tile: Tile): boolean {
		if (!tile) return true;

		const string = this._stringForTile(tile);
		return searchValue.every(r => r.test(string));
	}

	private _stringForTile(tile: Tile): string {
		const cachedValue = this._cache[tile.id];
		if (cachedValue) return cachedValue;

		const components: string[] = [tile.name, `${tile.id}`];

		return (this._cache[tile.id] = components.join(" "));
	}
}

export default TileFilter;
