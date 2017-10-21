type int16 = number;
type InstructionResult = number;

enum Flags {
	OK = 0,
	UpdateTiles = 1 << 0,
	UpdateText = 1 << 1,
	UpdateSound = 1 << 2,
	UpdateHero = 1 << 3,
	UpdateViewport = 1 << 4,
	UpdateHotspot = 1 << 5,
	UpdateNPC = 1 << 6,
	DidRedraw = 1 << 7,
	UpdateInventory = 1 << 8,
	UpdateGameState = 1 << 9,
	UpdateZone = 1 << 10,
	UpdateHealth = 1 << 11,
	Wait = 1 << 12
}

export { int16, Flags, InstructionResult };
