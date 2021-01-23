const TileSubtype = {
	Weapon: {
		BlasterLow: 16,
		BlasterHigh: 17,
		Lightsaber: 18,
		TheForce: 19
	},
	Locator: {
		Town: 1,

		PuzzleUnsolved: 2,
		PuzzleSolved: 3,
		TravelUnsolved: 4,
		TravelSolved: 5,

		NorthUnsolved: 6,
		SouthUnsolved: 7,
		WestUnsolved: 8,
		EastUnsolved: 9,

		NorthSolved: 10,
		SouthSolved: 11,
		WestSolved: 12,
		EastSolved: 13,

		Goal: 14,
		YouAreHere: 15
	},
	Item: {
		Keycard: 16 + 0,
		Tool: 16 + 1,
		Part: 16 + 2,
		Valuable: 16 + 3,
		Locator: 16 + 4,
		Consumable: 16 + 6
	},
	Character: {
		Hero: 16,
		Enemy: 17,
		NPC: 18
	},
	Floor: {
		Doorway: 16
	}
};

export { TileSubtype };
