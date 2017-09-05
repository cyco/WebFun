export default class Tile {
	static get WIDTH() {
		return 32;
	}

	static get HEIGHT() {
		return 32;
	}

	static get SIZE() {
		return 32 * 32;
	}

	constructor(id = -1, attributes = 0, pixelData = null) {
		this.id = id;
		this._name = null;
		this._attributes = attributes;
		this._image = null;
		this._subtype = 0;
		this._imageData = pixelData;

		Object.seal(this);
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

	getAttribute(attr) {
		return !!(this._attributes & (1 << attr));
	}

	getSubtype(attr) {
		return !!(this.subtype & (1 << attr));
	}

	get name() {
		return this._name;
	}

	get specs() {
		return this._attributes;
	}

	get imageData() {
		return this._image.data;
	}

	get image() {
		return this._image;
	}

	get pixelData() {
		return this._imageData;
	}

	get walkable() {
		return !this.getAttribute(Tile.Attribute.Object) && !this.getAttribute(Tile.Attribute.Character);
	}

	get attributes() {
		return this._attributes;
	}

	get subtype() {
		return this._attributes & 0xFFFF;
	}
}

Tile.Attribute = {
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

Tile.Subtype = {};

Tile.Subtype.Locator = {
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
};

Tile.Subtype[ Tile.Attribute.Weapon ] = {
	BlasterLow: 16,
	BlasterHigh: 17,
	Lightsaber: 18,
	TheForce: 19
};

Tile.Subtype.Item = {
	Locator: 4,

	Keycard: 0,
	PuzzleTool: 1,
	PuzzleGoal: 2,
	PuzzleValuable: 3,
	Consumeable: 6
};

Tile.Subtype[ Tile.Attribute.Type ] = {
	Hero: 16,
	Enemy: 17,
	NPC: 18
};


export const Attribute = Tile.Attribute;
export const Subtype = Tile.Subtype;
