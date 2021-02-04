import { Tile } from "src/engine/objects";

export default (attr: number, attrs: number): string => {
	const names: (string | ((_: number) => string))[] = [
		"Transparent",
		"Floor",
		"Object",
		"Draggable",
		"Roof",
		"Locator",
		"Weapon",
		"Item",
		"Character",
		,
		,
		,
		,
		,
		,
		,
		(attrs: number) => (attrs & (1 << Tile.Attribute.Character) ? "Hero" : null)
	];

	const name = names[attr] ?? null;
	return name instanceof Function ? name(attrs) : name;
};
