import LocatorTile from "../types/locator-tile";
import { Tile, Char } from "../objects";

abstract class GameType {
	public readonly name: string;
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
	abstract get strings(): { [_: number]: string };

	canBeEquipped(tile: Tile): boolean {
		return tile.isWeapon;
	}

	abstract getHealthBonus(_: Tile): number;
	abstract getMaxAmmo(_: Char): number;
	abstract getEquipSound(_: Char): number;
}

export default GameType;
