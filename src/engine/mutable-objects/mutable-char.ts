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

	public set id(id: number) {
		this._id = id;
	}

	public get id(): number {
		return this._id;
	}

	public set name(name: string) {
		this._name = name;
	}

	public get name(): string {
		return this._name;
	}

	public set frames(frames: [Char.Frame, Char.Frame, Char.Frame]) {
		this._frames = frames;
	}

	public get frames(): [Char.Frame, Char.Frame, Char.Frame] {
		return this._frames;
	}

	public set type(type: Char.Type) {
		this._type = type;
	}

	public get type(): Char.Type {
		return this._type;
	}

	public set movementType(movementType: Char.MovementType) {
		this._movementType = movementType;
	}

	public get movementType(): Char.MovementType {
		return this._movementType;
	}

	public set garbage1(garbage1: number) {
		this._garbage1 = garbage1;
	}

	public get garbage1(): number {
		return this._garbage1;
	}

	public set garbage2(garbage2: number) {
		this._garbage2 = garbage2;
	}

	public get garbage2(): number {
		return this._garbage2;
	}

	public set damage(d: number) {
		this._damage = d;
	}

	public get damage(): number {
		return this._damage;
	}

	public get health(): number {
		return this._health;
	}

	public set health(s: number) {
		this._health = s;
	}

	public set reference(r: number) {
		this._reference = r;
	}

	public get reference(): number {
		return this._reference;
	}
}

export default MutableChar;
