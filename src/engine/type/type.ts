import { Char, Tile } from "../objects";

import LocatorTile from "../types/locator-tile";

interface WellKnownSounds {
	NoGo: number;
	Hurt: number;
}

abstract class GameType {
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
	abstract get strings(): { [_: number]: string };
	abstract get sounds(): WellKnownSounds;

	canBeEquipped(tile: Tile): boolean {
		return tile.isWeapon();
	}

	abstract getHealthBonus(_: Tile): number;
	abstract getMaxAmmo(_: Char): number;
	abstract getEquipSound(_: Char): number;
	abstract get name(): string;
}

export default GameType;
