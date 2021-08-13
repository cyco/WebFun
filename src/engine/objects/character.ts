import CharacterType from "./character-type";

import CharacterFrame from "./character-frame";
import { CharacterFrameEntry } from "./character-frame-entry";
import CharacterMovementType from "./character-movement-type";
import { Direction } from "src/util";
import Tile from "./tile";
import AssetManager, { NullIfMissing } from "../asset-manager";
import { Character as RawCharacter } from "src/engine/file-format/types";

class Character {
	public static readonly Frame = CharacterFrame;
	public static readonly FrameEntry = CharacterFrameEntry;
	public static readonly Type = CharacterType;
	public static readonly MovementType = CharacterMovementType;

	public id: number;
	public frames: [CharacterFrame, CharacterFrame, CharacterFrame];
	public name: string = null;
	public type: CharacterType = null;
	public movementType: CharacterMovementType;
	public probablyGarbage1: number;
	public probablyGarbage2: number;
	public reference: number;
	public health: number;
	public damage: number;

	// TODO: remove property
	public tile: Tile;

	public constructor(id: number, data: Character | RawCharacter, assets: AssetManager) {
		this.id = id;
		this.name = data.name;
		this.probablyGarbage1 = data.probablyGarbage1;
		this.probablyGarbage2 = data.probablyGarbage2;
		this.reference = data.reference;
		this.health = data.health;
		this.damage = data.damage;

		if (data instanceof Character) {
			this.type = data.type;
			this.movementType = data.movementType;
			this.frames = data.frames.map(f => new CharacterFrame(f.tiles.slice())) as any;
		} else {
			this.type = CharacterType.fromNumber(data.type);
			this.movementType = CharacterMovementType.fromNumber(data.movementType);
			this.frames = [
				new CharacterFrame(data.frame1.mapArray(i => assets.get(Tile, i, NullIfMissing))),
				new CharacterFrame(data.frame2.mapArray(i => assets.get(Tile, i, NullIfMissing))),
				new CharacterFrame(data.frame3.mapArray(i => assets.get(Tile, i, NullIfMissing)))
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
		return this.type === CharacterType.Hero;
	}

	isEnemy(): boolean {
		return this.type === CharacterType.Enemy;
	}

	isWeapon(): boolean {
		return this.type === CharacterType.Weapon;
	}

	public getWeaponIcon(): Tile {
		if (!this.isWeapon()) return null;

		return this.frames[0].tiles[CharacterFrameEntry.ExtensionRight];
	}
}

declare namespace Character {
	export type Frame = CharacterFrame;
	export type FrameEntry = CharacterFrameEntry;
	export type Type = CharacterType;
	export type MovementType = CharacterMovementType;
}

export default Character;
