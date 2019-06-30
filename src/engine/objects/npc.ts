import Char from "./char";
import { CharFrameEntry } from "./char-frame";
import { Point } from "src/util";
import Zone from "./zone";
import { min } from "src/std/math";

class NPC {
	protected _id: number = -1;
	public enabled = true;
	public face: Char = null;
	protected _position: Point = null;
	protected _loot: number = -1;
	protected _dropsLoot: boolean = false;
	protected _data: number[] = Array.Repeat(-1, 0x20);
	private _damageTaken: number = 0;
	public bulletPosition: Point = null;
	public direction: Point = null;
	public currentActionFrame: number = 0;
	public currentBulletFrame: number = 0;
	public facingDirection: CharFrameEntry = CharFrameEntry.Up;

	get id() {
		return this._id;
	}

	get loot() {
		return this._loot;
	}

	get dropsLoot() {
		return this._dropsLoot;
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

	public get alive() {
		return this.face && this._damageTaken < this.face.health;
	}

	public get damageTaken() {
		return this._damageTaken;
	}

	public set damageTaken(d: number) {
		const maxDamage = this.face ? this.face.health : Infinity;

		this._damageTaken += d;
		this._damageTaken = min(this._damageTaken, maxDamage);
	}
}

export default NPC;
