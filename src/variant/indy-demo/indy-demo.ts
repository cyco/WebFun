import { WorldSize } from "src/engine/generation";
import { Point, rand } from "src/util";
import { Char, Tile, Zone } from "src/engine/objects";

import LocatorTile from "./locator-tile";
import Sounds from "./sounds";
import Variant from "src/engine/variant";
import { Engine, SaveState, Story } from "src/engine";

class IndyDemo extends Variant {
	get name(): string {
		return "Indy";
	}

	get saveGameMagic(): string {
		return "INDYSAV44";
	}

	get locatorTile(): LocatorTile {
		return new LocatorTile();
	}

	get strings(): {} {
		return {};
	}

	get sounds(): typeof Sounds {
		return Sounds;
	}

	public get mapTileId(): number {
		return -1;
	}

	public get weaponTileId(): number {
		return -1;
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

	public createNewStory(_: Engine): Story {
		return new Story(
			rand(),
			Zone.Planet.None,
			[WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
	}

	public save(_: Engine): SaveState {
		throw new Error("Method not implemented.");
	}

	public onPlaceTile(_tile: Tile, _at: Point, _engine: Engine): boolean {
		return false;
	}
}

export default IndyDemo;
