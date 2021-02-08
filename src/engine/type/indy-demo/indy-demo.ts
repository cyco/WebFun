import Engine from "src/engine/engine";
import Story from "src/engine/story";
import { Char, Tile } from "../../objects";

import GameType from "../type";
import LocatorTile from "./locator-tile";
import Sounds from "./sounds";

class IndyDemo extends GameType {
	createNewStory(_engine: Engine): Story {
		throw new Error("Method not implemented.");
	}
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
}

export default IndyDemo;
