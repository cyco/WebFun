import { Engine, Story } from "src/engine";
import { WorldSize } from "src/engine/generation";
import { rand } from "src/util";
import { Char, Tile, Zone } from "../../objects";

import Variant from "../variant";
import LocatorTile from "./locator-tile";
import Sounds from "./sounds";

class Indy extends Variant {
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
}

export default Indy;
