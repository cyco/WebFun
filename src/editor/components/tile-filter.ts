import Tile, { Attribute, Subtype } from "src/engine/objects/tile";

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

		if (tile.getAttribute(Attribute.Transparent)) components.push("transparent");
		if (tile.getAttribute(Attribute.Floor)) components.push("floor");
		if (tile.getAttribute(Attribute.Roof)) components.push("roof");
		if (tile.getAttribute(Attribute.Weapon)) {
			components.push("weapon");
			if (tile.getSubtype(Subtype.Weapon.BlasterHigh)) components.push("blaster");
			if (tile.getSubtype(Subtype.Weapon.BlasterLow)) components.push("blaster");
			if (tile.getSubtype(Subtype.Weapon.Lightsaber)) components.push("lightsaber");
			if (tile.getSubtype(Subtype.Weapon.TheForce)) components.push("the force");
		}

		if (tile.getAttribute(Attribute.Item)) {
			components.push("item");

			if (tile.getSubtype(Subtype.Item.Consumeable)) {
				components.push("consumeable");
				components.push("health");
			}

			if (tile.getSubtype(Subtype.Item.Keycard)) components.push("keycard");
			if (tile.getSubtype(Subtype.Item.Locator)) components.push("locator");
			if (tile.getSubtype(Subtype.Item.Part)) components.push("part");
			if (tile.getSubtype(Subtype.Item.Tool)) components.push("tool");
			if (tile.getSubtype(Subtype.Item.Valuable)) components.push("valuable");
		}

		if (tile.getAttribute(Attribute.Character)) {
			components.push("character");
			if (tile.getSubtype(Subtype.Character.Hero)) components.push("hero");
			if (tile.getSubtype(Subtype.Character.Enemy)) components.push("enemy");
			if (tile.getSubtype(Subtype.Character.NPC)) components.push("npc");
		}

		return (this._cache[tile.id] = components.join(" "));
	}
}

export default TileFilter;
