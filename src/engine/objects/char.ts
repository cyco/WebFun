import CharType from "./char-type";

import CharFrame from "./char-frame";
import { CharFrameEntry } from "./char-frame-entry";
import CharMovementType from "./char-movement-type";
import { Direction } from "src/util";
import Tile from "./tile";

class Char {
	public static readonly Frame = CharFrame;
	public static readonly FrameEntry = CharFrameEntry;
	public static readonly Type = CharType;
	public static readonly MovementType = CharMovementType;

	protected _id: number;
	protected _frames: [CharFrame, CharFrame, CharFrame];
	protected _name: string = null;
	protected _type: CharType = null;
	protected _movementType: CharMovementType;
	protected _garbage1: number = null;
	protected _garbage2: number = null;
	protected _reference: number = null;
	protected _health: number = null;
	protected _damage: number = null;

	public tile: Tile;

	get id(): number {
		return this._id;
	}

	get frames(): [CharFrame, CharFrame, CharFrame] {
		return this._frames;
	}

	get name(): string {
		return this._name;
	}

	get type(): CharType {
		return this._type;
	}

	get attackDuration(): number {
		return 4;
	}

	getFace(direction: number, frameIdx: number): Tile {
		if (this.isHero()) {
			frameIdx = frameIdx % 3;
		} else {
			frameIdx = 1 + (frameIdx % 2);
		}

		let tile = null;
		const frame = this._frames[frameIdx];
		if (!frame) return null;

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
		return this.type === CharType.Hero;
	}

	isEnemy(): boolean {
		return this.type === CharType.Enemy;
	}

	isWeapon(): boolean {
		return this.type === CharType.Weapon;
	}

	get movementType(): CharMovementType {
		return this._movementType;
	}

	get garbage1(): number {
		return this._garbage1;
	}

	get garbage2(): number {
		return this._garbage2;
	}

	get damage(): number {
		return this._damage;
	}

	get health(): number {
		return this._health;
	}

	get reference(): number {
		return this._reference;
	}

	public getWeaponIcon(): Tile {
		if (!this.isWeapon()) return null;

		return this.frames[0].tiles[CharFrameEntry.ExtensionRight];
	}
}

declare namespace Char {
	export type Frame = CharFrame;
	export type FrameEntry = CharFrameEntry;
	export type Type = CharType;
	export type MovementType = CharMovementType;
}

export default Char;
