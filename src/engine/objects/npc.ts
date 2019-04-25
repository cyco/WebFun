import Char from "./char";
import { Point } from "src/util";
import Zone from "./zone";

class NPC {
	protected _id: number = -1;
	protected _enabled = true;
	protected _character: Char = null;
	protected _position: Point = null;
	protected _unknown1: any;
	protected _unknown2: any;
	protected _data: any;
	public damageTaken: number = 0;

	constructor() {
		this._data = Array.Repeat(-1, 0x20); // 32 bytes
		this._unknown1 = 0;
		this._unknown2 = 0;
	}

	get id() {
		return this._id;
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(flag) {
		this._enabled = flag;
	}

	get face() {
		return this._character;
	}

	get unknown1() {
		return this._unknown1;
	}

	get unknown2() {
		return this._unknown2;
	}

	get unknown3() {
		return this._data;
	}

	get position() {
		return this._position;
	}

	set position(p: Point) {
		console.assert(p.z === Zone.Layer.Object, "NPCs must be placed on object layer!");
		this._position = p;
	}

	public isDead() {
		return this.damageTaken >= this._character.health;
	}
}

export default NPC;
