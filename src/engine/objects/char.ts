import { Direction } from "src/util";
import CharFrame from "./char-frame";
import Type from "./char-type";
import Tile from "./tile";
import CharMovementType from "./char-movement-type";

export { Type };

class Char {
	protected _id: number;
	protected _frames: [CharFrame, CharFrame, CharFrame];
	protected _name: string = null;
	protected _type: number = null;
	protected _movementType: CharMovementType;
	protected _garbage1: number;
	protected _garbage2: number;
	protected _reference: number;
	protected _health: number;
	protected _damage: number;

	get id() {
		return this._id;
	}

	get frames(): [CharFrame, CharFrame, CharFrame] {
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

	get movementType() {
		return this._movementType;
	}

	get garbage1() {
		return this._garbage1;
	}

	get garbage2() {
		return this._garbage2;
	}

	get damage() {
		return this._damage;
	}

	get health() {
		return this._health;
	}

	get reference() {
		return this._reference;
	}
}

export default Char;
