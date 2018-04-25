import GameType from "../type";
import LocatorTile from "./locator-tile";

class Yoda extends GameType {
	get saveGameMagic() {
		return "YODASAV44";
	}

	get locatorTile() {
		return new LocatorTile();
	}
}

export default Yoda;
