import { Char } from "src/engine/objects";

class MutableChar extends Char {
	constructor(char?: Char) {
		super();

		if (!char) return;

		this._id = char.id;
		this._name = char.name;
		this._frames = char.frames;
		this._type = char.type;
		this._movementType = char.movementType;
		this._garbage1 = char.garbage1;
		this._garbage2 = char.garbage2;
		this._reference = char.reference;
		this._damage = char.damage;
		this._health = char.health;
	}

	public set id(id) {
		this._id = id;
	}

	public get id() {
		return this._id;
	}

	public set name(name) {
		this._name = name;
	}

	public get name() {
		return this._name;
	}

	public set frames(frames) {
		this._frames = frames;
	}

	public get frames() {
		return this._frames;
	}

	public set type(type) {
		this._type = type;
	}

	public get type() {
		return this._type;
	}

	public set movementType(movementType) {
		this._movementType = movementType;
	}

	public get movementType() {
		return this._movementType;
	}

	public set garbage1(garbage1) {
		this._garbage1 = garbage1;
	}

	public get garbage1() {
		return this._garbage1;
	}

	public set garbage2(garbage2) {
		this._garbage2 = garbage2;
	}

	public get garbage2() {
		return this._garbage2;
	}

	public set damage(d) {
		this._damage = d;
	}

	public get damage() {
		return this._damage;
	}

	public get health() {
		return this._health;
	}

	public set health(s) {
		this._health = s;
	}

	public set reference(r) {
		this._reference = r;
	}

	public get reference() {
		return this._reference;
	}
}

export default MutableChar;
