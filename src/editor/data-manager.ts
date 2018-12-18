import { CompressedColorPalette, GameData, GameType, SaveState } from "src/engine";

class DataManager {
	private _currentData: GameData;
	private _palette: CompressedColorPalette;
	private _type: GameType;
	private _state: SaveState;
	private _stateData: GameData;

	constructor(data: GameData, palette: CompressedColorPalette, type: GameType) {
		this._currentData = data.copy();
		this._palette = palette;
		this._type = type;
	}

	get currentData() {
		return this._currentData;
	}

	get palette() {
		return this._palette;
	}

	get type() {
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
