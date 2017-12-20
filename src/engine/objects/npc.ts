import { Point } from "src/util";
import Char from "./char";

class NPC {
	protected _id: number;
	protected _enabled = true;
	protected _character: Char;
	protected _position: Point;
	protected _unknown1: any;
	protected _unknown2: any;
	protected _data: any;

	constructor() {
		this._enabled = true;
		this._data = Array.Repeat(-1, 0x20);
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
}

export default NPC;
