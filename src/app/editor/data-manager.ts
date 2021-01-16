import { ColorPalette, GameData, GameType, SaveState } from "src/engine";

class DataManager {
	private _currentData: GameData;
	private _palette: ColorPalette;
	private _type: GameType;
	private _state: SaveState;
	private _stateData: GameData;

	constructor(data: GameData, palette: ColorPalette, type: GameType) {
		this._currentData = data.copy();
		this._palette = palette;
		this._type = type;
	}

	get currentData(): GameData {
		return this._currentData;
	}

	get palette(): ColorPalette {
		return this._palette;
	}

	get type(): GameType {
		return this._type;
	}

	set state(state: SaveState) {
		this._state = state;
	}

	get state(): SaveState {
		return this._state;
	}

	set stateData(stateData: GameData) {
		this._stateData = stateData;
	}

	get stateData(): GameData {
		return this._stateData;
	}
}

export default DataManager;
