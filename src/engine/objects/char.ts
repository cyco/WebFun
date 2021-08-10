import CharType from "./char-type";

import CharFrame from "./char-frame";
import { CharFrameEntry } from "./char-frame-entry";
import CharMovementType from "./char-movement-type";
import { Direction } from "src/util";
import Tile from "./tile";
import AssetManager, { NullIfMissing } from "../asset-manager";
import { Character as RawChar } from "src/engine/file-format/types";

class Char {
	public static readonly Frame = CharFrame;
	public static readonly FrameEntry = CharFrameEntry;
	public static readonly Type = CharType;
	public static readonly MovementType = CharMovementType;

	public id: number;
	public frames: [CharFrame, CharFrame, CharFrame];
	public name: string = null;
	public type: CharType = null;
	public movementType: CharMovementType;
	public probablyGarbage1: number;
	public probablyGarbage2: number;
	public reference: number;
	public health: number;
	public damage: number;

	// TODO: remove property
	public tile: Tile;

	public constructor(id: number, data: Char | RawChar, assets: AssetManager) {
		this.id = id;
		this.name = data.name;
		this.probablyGarbage1 = data.probablyGarbage1;
		this.probablyGarbage2 = data.probablyGarbage2;
		this.reference = data.reference;
		this.health = data.health;
		this.damage = data.damage;

		if (data instanceof Char) {
			this.type = data.type;
			this.movementType = data.movementType;
			this.frames = data.frames.map(f => new CharFrame(f.tiles.slice())) as any;
		} else {
			this.type = CharType.fromNumber(data.type);
			this.movementType = CharMovementType.fromNumber(data.movementType);
			this.frames = [
				new CharFrame(data.frame1.mapArray(i => assets.get(Tile, i, NullIfMissing))),
				new CharFrame(data.frame2.mapArray(i => assets.get(Tile, i, NullIfMissing))),
				new CharFrame(data.frame3.mapArray(i => assets.get(Tile, i, NullIfMissing)))
			];
		}
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
		const frame = this.frames[frameIdx];
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
