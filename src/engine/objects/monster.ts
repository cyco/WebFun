import Char from "./char";
import { Point } from "src/util";
import Zone from "./zone";
import { min } from "src/std/math";

const MonsterInit = {
	_id: -1,
	enabled: true,
	face: null as Char,
	_position: null as Point,
	_loot: -1,
	_dropsLoot: false,
	_waypoints: [] as Point[],
	_damageTaken: 0,
	field10: 0,
	bulletX: 0,
	bulletY: 0,
	currentFrame: 0,
	flag18: false,
	flag1c: false,
	flag20: false,
	cooldown: 0,
	hasItem: false,
	flag2c: false,
	preferredDirection: 1,
	field32: 0,
	flag34: false,
	directionX: 0,
	directionY: 0,
	bulletOffset: 0,
	facingDirection: Char.FrameEntry.Up,
	field60: 0,
	field62: 0,
	currentActionFrame: 0
};

class Monster {
	protected _id: number;
	public enabled: boolean;
	public face: Char;
	protected _position: Point;
	protected _loot: number;
	protected _dropsLoot: boolean;
	protected _waypoints: Point[];
	private _damageTaken: number;
	public field10: number;
	public bulletX: number;
	public bulletY: number;
	public currentFrame: number;
	public flag18: boolean;
	public flag1c: boolean;
	public flag20: boolean;
	public cooldown: number;
	public hasItem: boolean;
	public flag2c: boolean;
	public preferredDirection: number;
	public field32: number;
	public flag34: boolean;
	public directionX: number;
	public directionY: number;
	public bulletOffset: number;
	public facingDirection: Char.FrameEntry;
	public field60: number;
	public field62: number;
	public currentActionFrame: number;

	constructor(npc: Monster | typeof MonsterInit | Partial<typeof MonsterInit> = MonsterInit) {
		Object.assign(this, MonsterInit, npc);
	}

	get id(): number {
		return this._id;
	}

	get loot(): number {
		return this._loot;
	}

	get dropsLoot(): boolean {
		return this._dropsLoot;
	}

	get waypoints(): Point[] {
		return this._waypoints;
	}

	get position(): Point {
		return this._position;
	}

	set position(p: Point) {
		console.assert(p.z === Zone.Layer.Object, "Monsters must be placed on object layer!");
		this._position = p;
	}

	public get alive(): boolean {
		return this.face && (!this._damageTaken || this._damageTaken < this.face.health);
	}

	public get damageTaken(): number {
		return this._damageTaken;
	}

	public set damageTaken(d: number) {
		const maxDamage = this.face ? this.face.health : Infinity;

		this._damageTaken += d;
		this._damageTaken = min(this._damageTaken, maxDamage);
	}

	public get x(): number {
		return this.position.x;
	}

	public set x(v: number) {
		this.position.x = v;
	}

	public get y(): number {
		return this.position.y;
	}

	public set y(v: number) {
		this.position.y = v;
	}

	public set direction(d: Point) {
		this.directionX = d.x;
		this.directionY = d.y;
	}

	public get direction(): Point {
		return new Point(this.directionX, this.directionY);
	}

	public set bullet(d: Point) {
		this.bulletX = d.x;
		this.bulletY = d.y;
	}

	public get bullet(): Point {
		return new Point(this.bulletX, this.bulletY);
	}
}

export default Monster;
