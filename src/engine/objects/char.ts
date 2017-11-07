import { Direction } from "src/util";
import CharFrame from "./char-frame";
import Type from "./char-type";
import Tile from "./tile";

export { Type };

class Char {
	private _id: number;
	private _frames: CharFrame[] = [];
	private _name: string = null;
	private _type: number = null;
	public _movementType: number;
	public _garbage1: number;
	public _garbage2: number;

	public reference: number;
	public health: number;
	public damage: number;

	get id() {
		return this._id;
	}

	get frames() {
		return this._frames;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	get attackDuration() {
		return 4;
	}

	getFace(direction: number, frameIdx: number): Tile {
		if (this.isHero()) {
			frameIdx = frameIdx % 3;
		} else {
			frameIdx = 1 + frameIdx % 2;
		}

		let tile = null;
		let frame = this._frames[frameIdx];

		const dir = Direction.Confine(direction);
		switch (dir) {
			case Direction.NorthEast:
			case Direction.NorthWest:
			case Direction.North:
				tile = frame.up;
				break;
			case Direction.SouthEast:
			case Direction.SouthWest:
			case Direction.South:
				tile = frame.down;
				break;
			case Direction.East:
				tile = frame.right;
				break;
			case Direction.West:
				tile = frame.left;
				break;
		}

		return tile;
	}

	isHero(): boolean {
		return !!(this.type & Type.Hero);
	}

	isEnemy(): boolean {
		return !!(this.type & Type.Enemy);
	}

	isWeapon(): boolean {
		return !!(this.type & Type.Weapon);
	}
}

export default Char;
