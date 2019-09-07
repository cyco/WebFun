export const WIDTH = 32;
export const HEIGHT = 32;
export const SIZE = WIDTH * HEIGHT;

const enum TileAttributes {
	Transparent = 1 << 0,
	Floor = 1 << 1,
	Object = 1 << 2,
	Draggable = 1 << 3,
	Roof = 1 << 4,
	Locator = 1 << 5,
	Weapon = 1 << 6,
	Item = 1 << 7,
	Character = 1 << 8,

	Edible = Character | (1 << 22),
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
		Consumeable: 16 + 6
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

class Tile {
	public static readonly WIDTH = WIDTH;
	public static readonly HEIGHT = HEIGHT;
	public static readonly SIZE = SIZE;
	public static readonly Attribute = TileAttribute;
	public static readonly Subtype = TileSubtype;

	protected _id: number;
	protected _name: string;
	protected _attributes: any;
	protected _imageData: Uint8Array;

	get walkable() {
		return !this.getAttribute(TileAttribute.Object) && !this.getAttribute(TileAttribute.Character);
	}

	get subtype() {
		return this._attributes & ~0xff;
	}

	public isObject() {
		return this.getAttribute(TileAttribute.Object);
	}

	public isDraggable() {
		return this.getAttribute(TileAttribute.Draggable);
	}

	public isLocator() {
		return (
			this.getAttribute(TileAttribute.Locator) ||
			(this.isItem() && this.getSubtype(TileSubtype.Item.Locator))
		);
	}

	public isOpaque() {
		return 0 === (this._attributes & 1);
	}

	public isItem() {
		return this.getAttribute(TileAttribute.Item);
	}

	public isKeycard() {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Keycard);
	}

	public isPart() {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Part);
	}

	public isTool() {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Tool);
	}

	public isValuable() {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Valuable);
	}

	public isWeapon() {
		return (this.attributes & TileAttributes.Weapon) !== 0;
	}

	public isEdible() {
		return (this.attributes & TileAttributes.Edible) === TileAttributes.Edible;
	}

	public isDoorway() {
		return (this._attributes & TileAttributes.Doorway) === TileAttributes.Doorway;
	}

	public isCharacter() {
		return (this._attributes & TileAttributes.Character) === TileAttributes.Character;
	}

	getAttribute(attr: number): boolean {
		return !!(this._attributes & (1 << attr));
	}

	getSubtype(attr: number): boolean {
		return !!(this.subtype & (1 << attr));
	}

	public get id() {
		return this._id;
	}

	public get name() {
		return this._name;
	}

	public get attributes() {
		return this._attributes;
	}

	public get imageData() {
		return this._imageData;
	}
}

namespace Tile {
	export type Attributes = TileAttributes;
}

export default Tile;
