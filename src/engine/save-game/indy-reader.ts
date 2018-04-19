import Reader from "./reader";
import SaveState from "./save-state";
import GameData from "../game-data";

class IndyReader extends Reader {
	public read(gameData: GameData): SaveState {
		this._data = gameData;
		return this._doRead();
	}
}

export default IndyReader;
