import GameType from "../type";
import LocatorTile from "./locator-tile";
import { Tile, Char } from "../../objects";
import Sounds from "./sounds";

class Indy extends GameType {
	get name() {
		return "Indy";
	}

	get saveGameMagic() {
		return "INDYSAV44";
	}

	get locatorTile() {
		return new LocatorTile();
	}

	get strings() {
		return {};
	}

	get sounds() {
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

export default Indy;
