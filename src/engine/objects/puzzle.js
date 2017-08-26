import Type from "./puzzle-type";

export { Type };

export default class Puzzle {
	constructor() {
		this.id = -1;
		this._name = null;
		this._type = -1;
		this._unknown1 = null;
		this._unknown2 = null;
		this._unknown3 = null;

		this._strings = [];
		this.item_1 = -1;
		this.item_2 = -1;

		this.hasPuzzleNPC = false; // aka hasPuzzleNPC

		Object.seal(this);
	}

	get type() {
		return this._type;
	}

	get strings() {
		return this._strings;
	}
}
