export const WIDTH = 32;
export const HEIGHT = 32;
export const SIZE = WIDTH * HEIGHT;

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

class Tile {
	public static readonly WIDTH = WIDTH;
	public static readonly HEIGHT = HEIGHT;
	public static readonly SIZE = SIZE;
	public static readonly Attribute = TileAttribute;
	public static readonly Attributes = TileAttributes;
	public static readonly Subtype = TileSubtype;

	protected _id: number;
	protected _name: string;
	protected _attributes: number;
	protected _imageData: Uint8Array;

	get walkable(): boolean {
		return !this.getAttribute(TileAttribute.Object) && !this.getAttribute(TileAttribute.Character);
	}

	get subtype(): number {
		return this._attributes & ~0xff;
	}

	public isObject(): boolean {
		return this.getAttribute(TileAttribute.Object);
	}

	public isDraggable(): boolean {
		return this.getAttribute(TileAttribute.Draggable);
	}

	public isLocator(): boolean {
		return (
			this.getAttribute(TileAttribute.Locator) ||
			(this.isItem() && this.getSubtype(TileSubtype.Item.Locator))
		);
	}

	public isOpaque(): boolean {
		return 0 === (this._attributes & 1);
	}

	public isItem(): boolean {
		return this.getAttribute(TileAttribute.Item);
	}

	public isKeycard(): boolean {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Keycard);
	}

	public isPart(): boolean {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Part);
	}

	public isTool(): boolean {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Tool);
	}

	public isValuable(): boolean {
		return this.isItem() && this.getSubtype(TileSubtype.Item.Valuable);
	}

	public isWeapon(): boolean {
		return (this._attributes & TileAttributes.Weapon) !== 0;
	}

	public isEdible(): boolean {
		return (this._attributes & TileAttributes.Edible) === TileAttributes.Edible;
	}

	public isDoorway(): boolean {
		return (this._attributes & TileAttributes.Doorway) === TileAttributes.Doorway;
	}

	public isCharacter(): boolean {
		return (this._attributes & TileAttributes.Character) === TileAttributes.Character;
	}

	getAttribute(attr: number): boolean {
		return !!(this._attributes & (1 << attr));
	}

	getSubtype(attr: number): boolean {
		return !!(this.subtype & (1 << attr));
	}

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public get attributes(): number {
		return this._attributes;
	}

	public get imageData(): Uint8Array {
		return this._imageData;
	}
}

declare namespace Tile {
	export type Attributes = TileAttributes;
}

export default Tile;
