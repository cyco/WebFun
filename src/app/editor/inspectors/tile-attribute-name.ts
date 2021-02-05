import { Tile } from "src/engine/objects";

export default (attr: number, attrs: number): string => {
	if (attr === Tile.Attribute.Transparent) return "Transparent";
	if (attr === Tile.Attribute.Floor) return "Floor";
	if (attr === Tile.Attribute.Object) return "Object";
	if (attr === Tile.Attribute.Draggable) return "Draggable";
	if (attr === Tile.Attribute.Roof) return "Roof";
	if (attr === Tile.Attribute.Locator) return "Locator";
	if (attr === Tile.Attribute.Weapon) return "Weapon";
	if (attr === Tile.Attribute.Item) return "Item";
	if (attr === Tile.Attribute.Character) return "Character";

	if (attr === 16 && attrs & Tile.Attributes.Hero) return "Hero";
	if (attr === 22 && attrs & Tile.Attributes.Item) return "Edible";
	if (attr === 20 && attrs & Tile.Attributes.Item) return "Map";
	if (attr === 15 && attrs & Tile.Attributes.Floor) return "Doorway";

	return null;
};
