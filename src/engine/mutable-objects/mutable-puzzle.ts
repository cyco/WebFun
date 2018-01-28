import { Puzzle } from "src/engine/objects";

class MutablePuzzle extends Puzzle {
	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get item1() {
		return this._item1;
	}

	set item1(value) {
		this._item1 = value;
	}

	get item2() {
		return this._item2;
	}

	set item2(value) {
		this._item2 = value;
	}

	get strings() {
		return this._strings;
	}

	set strings(value) {
		this._strings = value;
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get unknown1() {
		return this._unknown1;
	}

	set unknown1(value) {
		this._unknown1 = value;
	}

	get unknown2() {
		return this._unknown2;
	}

	set unknown2(value) {
		this._unknown2 = value;
	}

	get unknown3() {
		return this._unknown3;
	}

	set unknown3(value) {
		this._unknown3 = value;
	}
}

export default MutablePuzzle;
