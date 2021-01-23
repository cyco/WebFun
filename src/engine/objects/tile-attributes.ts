enum TileAttributes {
	Transparent = 1 << 0,
	Floor = 1 << 1,
	Object = 1 << 2,
	Draggable = 1 << 3,
	Roof = 1 << 4,
	Locator = 1 << 5,
	Weapon = 1 << 6,
	Item = 1 << 7,
	Character = 1 << 8,

	Edible = Item | (1 << 22),
	Doorway = Floor | (1 << 15)
}

const TileAttribute = {
	Transparent: 0,
	Floor: 1,
	Object: 2,
	Draggable: 3,
	Roof: 4,
	Locator: 5,
	Weapon: 6,
	Item: 7,
	Character: 8
};

export { TileAttribute, TileAttributes };
