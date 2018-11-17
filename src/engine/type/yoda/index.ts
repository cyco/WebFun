import GameType from "../type";
import LocatorTile from "./locator-tile";
import { Tile, Char } from "src/engine/objects";
import Strings from "./strings";

class Yoda extends GameType {
	get name() {
		return "Yoda Stories";
	}

	get saveGameMagic() {
		return "YODASAV44";
	}

	get locatorTile() {
		return new LocatorTile();
	}

	get strings() {
		return Strings;
	}

	public isEdible(_: Tile): boolean {
		return false;
	}

	public getHealthBonus(_: Tile): number {
		return 0;
	}

	public getMaxAmmo(_: Char): number {
		return 0;
	}

	public getEquipSound(_: Char): number {
		return 0;
	}
}

export default Yoda;
