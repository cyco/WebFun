import Char from "./char";
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
	protected _waypoints: Point[] = [];
	private _damageTaken: number = 0;
	public field10: number = 0;
	public bulletX: number = 0;
	public bulletY: number = 0;
	public currentFrame: number = 0;
	public flag18: boolean = false;
	public flag1c: boolean = false;
	public flag20: boolean = false;
	public cooldown: number = 0;
	public hasItem: boolean = false;
	public flag2c: boolean = false;
	public preferredDirection: number = 1;
	public field32: number = 0;
	public flag34: boolean = false;
	public directionX: number = 0;
	public directionY: number = 0;
	public field3c: number = 0;
	public facingDirection: Char.FrameEntry = Char.FrameEntry.Up;
	public field60: number = 0;
	public field62: number = 0;

	// TODO: Fix:
	public currentActionFrame: number = 0;

	get id() {
		return this._id;
	}

	get loot() {
		return this._loot;
	}

	get dropsLoot() {
		return this._dropsLoot;
	}

	get waypoints() {
		return this._waypoints;
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

	public get x() {
		return this.position.x;
	}

	public set x(v) {
		this.position.x = v;
	}

	public get y() {
		return this.position.y;
	}

	public set y(v) {
		this.position.y = v;
	}

	public set direction(d: Point) {
		this.directionX = d.x;
		this.directionY = d.y;
	}

	public get direction() {
		return new Point(this.directionX, this.directionY);
	}

	public set bullet(d: Point) {
		this.bulletX = d.x;
		this.bulletY = d.y;
	}

	public get bullet() {
		return new Point(this.bulletX, this.bulletY);
	}
}

export default NPC;
