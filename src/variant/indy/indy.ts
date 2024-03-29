import { WorldSize } from "src/engine/generation";
import { Point, rand } from "src/util";
import { Character, Tile, Zone } from "src/engine/objects";
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
	public readonly mapTileId = 443;
	public readonly weaponTileId = 450;

	get locatorTile(): LocatorTile {
		return new LocatorTile();
	}

	get sounds(): typeof Sounds {
		return Sounds;
	}

	public getHealthBonus(_: Tile): number {
		return 0;
	}

	public getMaxAmmo(_: Character): number {
		return -1;
	}

	public getEquipSound(_: Character): number {
		return 0;
	}

	public createNewStory(engine: Engine): Story {
		const size = engine.settings.worldSize;

		const story = new Story(engine.assets, engine.variant);
		story.generate(
			rand(),
			Zone.Planet.None,
			WorldSize.isWorldSize(size)
				? WorldSize.fromNumber(size)
				: [WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
		return story;
	}

	public takeSnapshot(_: Engine): SaveState {
		throw new Error("Method not implemented.");
	}

	public onPlaceTile(_tile: Tile, _at: Point, _engine: Engine): boolean {
		return false;
	}
}

export default IndyFull;
