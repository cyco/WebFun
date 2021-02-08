import Story from "../story";
import { Char, Tile } from "../objects";

import LocatorTile from "./locator-tile";
import Engine from "../engine";

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
		return tile.hasAttributes(Tile.Attributes.Weapon);
	}

	abstract getHealthBonus(_: Tile): number;
	abstract getMaxAmmo(_: Char): number;
	abstract getEquipSound(_: Char): number;
	abstract get name(): string;

	abstract createNewStory(_engine: Engine): Story;
}

export default GameType;
