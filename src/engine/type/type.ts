import LocatorTile from "../types/locator-tile";
import { Tile, Char } from "../objects";

type WellKnownSounds = {
	NoGo: number;
	Hurt: number;
};

abstract class GameType {
	public readonly name: string;
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
	abstract get strings(): { [_: number]: string };
	abstract get sounds(): WellKnownSounds;

	canBeEquipped(tile: Tile): boolean {
		return tile.isWeapon;
	}

	abstract getHealthBonus(_: Tile): number;
	abstract getMaxAmmo(_: Char): number;
	abstract getEquipSound(_: Char): number;
}

export default GameType;
