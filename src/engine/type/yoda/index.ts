import GameType from "../type";
import LocatorTile from "./locator-tile";

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
}

export default Yoda;
