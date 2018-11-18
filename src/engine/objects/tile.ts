import { Image } from "src/engine/rendering";

export const WIDTH = 32;
export const HEIGHT = 32;
export const SIZE = WIDTH * HEIGHT;

export const enum Attributes {
	Transparent = 1 << 0,
	Floor = 1 << 1,
	Objecvt = 1 << 2,
	Draggabe = 1 << 3,
	Roof = 1 << 4,
	Locator = 1 << 5,
	Weapon = 1 << 6,
	Item = 1 << 7,
	Character = 1 << 8,

	Edible = Character & (1 << 22)
}

export const Attribute = {
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

export const Subtype = {
	Weapon: {
		// Weapon
		BlasterLow: 16,
		BlasterHigh: 17,
		Lightsaber: 18,
		TheForce: 19
	},
	Locator: {
		// Locator
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
		// Item
		Locator: 4,

		Keycard: 0,
		PuzzleTool: 1,
		PuzzleGoal: 2,
		PuzzleValuable: 3,
		Consumeable: 6
	},
	Character: {
		// Character
		Hero: 16,
		Enemy: 17,
		NPC: 18
	}
};

export class Tile {
	static readonly WIDTH = WIDTH;
	static readonly HEIGHT = HEIGHT;
	static readonly SIZE = SIZE;
	static readonly Attribute = Attribute;
	static readonly Subtype = Subtype;

	protected _id: number;
	protected _name: string;
	protected _attributes: any;
	protected _imageData: Uint8Array;
	public image: Image;

	get walkable() {
		return !this.getAttribute(Tile.Attribute.Object) && !this.getAttribute(Tile.Attribute.Character);
	}

	get subtype() {
		return this._attributes & ~0xff;
	}

	isObject() {
		return this.getAttribute(Tile.Attribute.Object);
	}

	isDraggable() {
		return this.getAttribute(Tile.Attribute.Draggable);
	}

	isLocator() {
		return this.getAttribute(Tile.Attribute.Locator);
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

	public get isWeapon() {
		return (this.attributes & Attributes.Weapon) !== 0;
	}

	public get isEdible() {
		return (this.attributes & Attributes.Edible) !== 0;
	}
}

export default Tile;
