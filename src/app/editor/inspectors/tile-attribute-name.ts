import { Tile } from "src/engine/objects";

export default (attr: number, attrs: number): string => {
	switch (1 << attr) {
		// Global
		case Tile.Attributes.Transparent:
			return "Transparent";
		case Tile.Attributes.Floor:
			return "Floor";
		case Tile.Attributes.Object:
			return "Object";
		case Tile.Attributes.Draggable:
			return "Draggable";
		case Tile.Attributes.Roof:
			return "Roof";

		// Main-type
		case Tile.Attributes.Locator:
			return "Locator";
		case Tile.Attributes.Weapon:
			return "Weapon";
		case Tile.Attributes.Item:
			return "Item";
		case Tile.Attributes.Character:
			return "Character";
	}

	// Sub-type
	if (attrs & Tile.Attributes.Floor) {
		switch ((1 << attr) | Tile.Attributes.Floor) {
			case Tile.Attributes.Doorway:
				return "Doorway";
		}
	}

	if (attrs & Tile.Attributes.Locator) {
		switch ((1 << attr) | Tile.Attributes.Locator) {
		}
	}

	if (attrs & Tile.Attributes.Weapon) {
		switch ((1 << attr) | Tile.Attributes.Weapon) {
			case Tile.Attributes.BlasterLow:
				return "Blaster Low";
			case Tile.Attributes.BlasterHigh:
				return "Blaster High";
			case Tile.Attributes.Lightsaber:
				return "Lightsaber";
			case Tile.Attributes.TheForce:
				return "The Force";
		}
	}

	if (attrs & Tile.Attributes.Item) {
		switch ((1 << attr) | Tile.Attributes.Item) {
			case Tile.Attributes.Map:
				return "Map";
			case Tile.Attributes.Keycard:
				return "Keycard";
			case Tile.Attributes.Tool:
				return "Tool";
			case Tile.Attributes.Part:
				return "Part";
			case Tile.Attributes.Valuable:
				return "Valuable";
			case Tile.Attributes.Edible:
				return "Edible";
		}
	}

	if (attrs & Tile.Attributes.Character) {
		switch ((1 << attr) | Tile.Attributes.Character) {
			case Tile.Attributes.Hero:
				return "Hero";
			case Tile.Attributes.Enemy:
				return "Enemy";
			case Tile.Attributes.NPC:
				return "NPC";
		}
	}

	return null;
};
