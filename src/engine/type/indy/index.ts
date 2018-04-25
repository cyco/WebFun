import GameType from "../type";
import LocatorTile from "./locator-tile";

class Indy extends GameType {
	get saveGameMagic() {
		return "INDYSAV44";
	}

	get locatorTile() {
		return new LocatorTile();
	}
}

export default Indy;
