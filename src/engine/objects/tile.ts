import { Image } from "../rendering";

class Tile {
	static readonly WIDTH = 32;
	static readonly HEIGHT = 32;
	static readonly SIZE = 32 * 32;
	static readonly Attribute = {
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
	static readonly Subtype = {
		Weapon: { // Weapon
			BlasterLow: 16,
			BlasterHigh: 17,
			Lightsaber: 18,
			TheForce: 19
		},
		Locator: { // Locator
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
		Item: { // Item
			Locator: 4,

			Keycard: 0,
			PuzzleTool: 1,
			PuzzleGoal: 2,
			PuzzleValuable: 3,
			Consumeable: 6
		},
		Character: { // Character
			Hero: 16,
			Enemy: 17,
			NPC: 18
		}
	};

	public id: number;
	public _name: string;
	public _attributes: any;
	public _image: Image;
	public _imageData: any;

	constructor(id: number = -1, attributes: number = 0, pixelData: any = null) {
		this.id = id;
		this._name = null;
		this._attributes = attributes;
		this._image = null;
		this._imageData = pixelData;

		Object.seal(this);
	}

	get name() {
		return this._name;
	}

	get specs() {
		return this._attributes;
	}

	get imageData() {
		return (<any>this._image).data;
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
}

export const Attribute = Tile.Attribute;
export const Subtype = Tile.Subtype;
export default Tile;
