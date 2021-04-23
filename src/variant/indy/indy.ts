import { WorldSize } from "src/engine/generation";
import { Point, rand } from "src/util";
import { Char, Tile, Zone } from "src/engine/objects";
import Variant from "src/engine/variant";
import { Engine, Story, SaveState } from "src/engine";

import LocatorTile from "./locator-tile";
import Sounds from "./sounds";
import { ColorCycle } from "src/engine/rendering/palette-animation";

class IndyFull extends Variant {
	public slowColorCycles: ColorCycle[] = [
		/* [start , color count ] */
		[0xee, 6],
		[0xf4, 2]
	];
	public fastColorCycles: ColorCycle[] = [
		/* [start , color count ] */
		[0xa0, 8],
		[0xe0, 5],
		[0xe5, 9]
	];
	public readonly mapKey = "KeyM";
	public readonly saveGameMagic = "INDYSAV44";
	public readonly mapTileId = 0x1bb;
	public readonly weaponTileId = 0x1c2;

	get locatorTile(): LocatorTile {
		return new LocatorTile();
	}

	get sounds(): typeof Sounds {
		return Sounds;
	}

	public getHealthBonus(_: Tile): number {
		return 0;
	}

	public getMaxAmmo(_: Char): number {
		return -1;
	}

	public getEquipSound(_: Char): number {
		return 0;
	}

	public createNewStory(engine: Engine): Story {
		const size = engine.settings.worldSize;

		return new Story(
			rand(),
			Zone.Planet.None,
			WorldSize.isWorldSize(size)
				? WorldSize.fromNumber(size)
				: [WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
	}

	public save(_: Engine): SaveState {
		throw new Error("Method not implemented.");
	}

	public onPlaceTile(_tile: Tile, _at: Point, _engine: Engine): boolean {
		return false;
	}
}

export default IndyFull;
