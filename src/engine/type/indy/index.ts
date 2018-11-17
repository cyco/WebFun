import GameType from "../type";
import LocatorTile from "./locator-tile";
import { Tile, Char } from "../../objects";

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

export default Indy;
