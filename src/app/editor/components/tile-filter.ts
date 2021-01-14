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

		if (tile.isDraggable()) {
			components.push("draggable");
		}

		if (tile.isLocator()) {
			components.push("locator");
		}

		if (tile.isObject()) {
			components.push("object");
		}

		if (tile.getAttribute(Tile.Attribute.Transparent)) components.push("transparent");
		if (tile.getAttribute(Tile.Attribute.Floor)) components.push("floor");
		if (tile.getAttribute(Tile.Attribute.Roof)) components.push("roof");
		if (tile.getAttribute(Tile.Attribute.Weapon)) {
			components.push("weapon");
			if (tile.getSubtype(Tile.Subtype.Weapon.BlasterHigh)) components.push("blaster");
			if (tile.getSubtype(Tile.Subtype.Weapon.BlasterLow)) components.push("blaster");
			if (tile.getSubtype(Tile.Subtype.Weapon.Lightsaber)) components.push("lightsaber");
			if (tile.getSubtype(Tile.Subtype.Weapon.TheForce)) components.push("the force");
		}

		if (tile.getAttribute(Tile.Attribute.Item)) {
			components.push("item");

			if (tile.getSubtype(Tile.Subtype.Item.Consumeable)) {
				components.push("consumeable");
				components.push("health");
			}

			if (tile.getSubtype(Tile.Subtype.Item.Keycard)) components.push("keycard");
			if (tile.getSubtype(Tile.Subtype.Item.Locator)) components.push("locator");
			if (tile.getSubtype(Tile.Subtype.Item.Part)) components.push("part");
			if (tile.getSubtype(Tile.Subtype.Item.Tool)) components.push("tool");
			if (tile.getSubtype(Tile.Subtype.Item.Valuable)) components.push("valuable");
		}

		if (tile.getAttribute(Tile.Attribute.Character)) {
			components.push("character");
			if (tile.getSubtype(Tile.Subtype.Character.Hero)) components.push("hero");
			if (tile.getSubtype(Tile.Subtype.Character.Enemy)) components.push("enemy");
			if (tile.getSubtype(Tile.Subtype.Character.NPC)) components.push("npc");
		}

		return (this._cache[tile.id] = components.join(" "));
	}
}

export default TileFilter;
