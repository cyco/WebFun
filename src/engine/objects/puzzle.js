export const Type = {
	U1: 0,
	U2: 1,
	U3: 2,
	End: 3,
	U4: 4,

	Disabled: 0xFFFF
};

export default class Puzzle {
	constructor() {
		this.id = -1;
		this._name = null;
		this._type = -1;
		this._unknown1 = null;
		this._unknown2 = null;
		this._unknown3 = null;

		this._strings = [];
		this._itemIDs = [];
		this.item_1 = -1;
		this.item_2 = -1;

		this.hasPuzzleNPC = false; // aka hasPuzzleNPC

		Object.seal(this);
	}

	get type() {
		return this._type;
	}

	get _unknown_3() {
		return this.hasPuzzleNPC;
	}

	get unknown_3() {
		return this.hasPuzzleNPC;
	}
}
