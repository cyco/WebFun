import Character from "./character";
import { Point } from "src/util";
import { min } from "src/std/math";
import { Monster as RawMonster } from "src/engine/file-format/types";
import AssetManager, { NullIfMissing } from "../asset-manager";
import Zone from "./zone";

class Monster {
	public id: number;
	public enabled: boolean = true;
	public face: Character;
	public position: Point;
	public loot: number;
	public dropsLoot: boolean;
	public waypoints: Point[];

	// Runtime attributes
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
	public preferredDirection: Character.FrameEntry = Character.FrameEntry.Down;
	public field32: number = 0;
	public flag34: boolean = false;
	public directionX: number = 0;
	public directionY: number = 0;
	public bulletOffset: number = 0;
	public facingDirection: Character.FrameEntry = Character.FrameEntry.Up;
	public field60: number = 0;
	public field62: number = 0;
	public currentActionFrame: number = 0;

	constructor(id: number, data: Monster | RawMonster, assets: AssetManager) {
		this.id = id;
		this.position = new Point(data.x, data.y, Zone.Layer.Object);
		this.dropsLoot = data.dropsLoot;
		this.loot = data.loot;

		if (data instanceof Monster) {
			this.face = data.face;
			this.waypoints = data.waypoints.map(p => new Point(p.x, p.y));
		} else {
			this.face = assets.get(Character, data.character, NullIfMissing);
			const waypoints = [];
			for (let i = 0; i < data.waypoints.length; i += 2) {
				waypoints.push(new Point(data.waypoints[i], data.waypoints[i + 1]));
			}
			this.waypoints = waypoints;
		}
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
