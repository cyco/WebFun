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

	Doorway = Floor | (1 << 16),

	Town = Locator | (1 << 17),

	PuzzleUnsolved = Locator | (1 << 18),
	PuzzleSolved = Locator | (1 << 19),
	TravelUnsolved = Locator | (1 << 20),
	TravelSolved = Locator | (1 << 21),
	NorthUnsolved = Locator | (1 << 22),
	SouthUnsolved = Locator | (1 << 23),
	WestUnsolved = Locator | (1 << 24),
	EastUnsolved = Locator | (1 << 25),
	NorthSolved = Locator | (1 << 26),
	SouthSolved = Locator | (1 << 27),
	WestSolved = Locator | (1 << 28),
	EastSolved = Locator | (1 << 29),
	Goal = Locator | (1 << 30),
	YouAreHere = Locator | (1 << 31),

	BlasterLow = Weapon | (1 << 16),
	BlasterHigh = Weapon | (1 << 17),
	Lightsaber = Weapon | (1 << 18),
	TheForce = Weapon | (1 << 19),

	Map = Item | (1 << 20),
	Keycard = Item | (1 << 16),
	Tool = Item | (1 << 17),
	Part = Item | (1 << 18),
	Valuable = Item | (1 << 19),
	Edible = Item | (1 << 22),

	Hero = Character | (1 << 16),
	Enemy = Character | (1 << 17),
	NPC = Character | (1 << 18)
}
export default TileAttributes;
