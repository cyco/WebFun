import Reader from "./reader";
import SaveState from "./save-state";
import GameData from "../game-data";

class YodaReader extends Reader {
	public read(gameData: GameData): SaveState {
		this._data = gameData;
		return this._doRead();
	}
}

export default YodaReader;
