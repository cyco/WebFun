import Story from "./story";
import { Char, Tile } from "./objects";

import LocatorTile from "./locator-tile";
import Engine from "./engine";
import { SaveState } from "./save-game";
import { Point } from "src/util";
import { ColorCycle } from "./rendering/palette-animation";

interface WellKnownSounds {
	NoGo: number;
	Hurt: number;
}

abstract class Variant {
	abstract readonly slowColorCycles: ColorCycle[];
	abstract readonly fastColorCycles: ColorCycle[];
	abstract readonly mapKey: string;

	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
	abstract get sounds(): WellKnownSounds;

	canBeEquipped(tile: Tile): boolean {
		return tile.hasAttributes(Tile.Attributes.Weapon);
	}

	abstract getHealthBonus(_: Tile): number;
	abstract getMaxAmmo(_: Char): number;
	abstract getEquipSound(_: Char): number;

	abstract get mapTileId(): number;
	abstract get weaponTileId(): number;

	abstract createNewStory(_engine: Engine): Story;
	abstract save(engine: Engine): SaveState;

	abstract onPlaceTile(tile: Tile, at: Point, engine: Engine): boolean;
}

export default Variant;
