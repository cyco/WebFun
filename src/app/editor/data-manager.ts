import { ColorPalette, AssetManager, Variant, SaveState } from "src/engine";

class DataManager {
	private _currentData: AssetManager;
	private _palette: ColorPalette;
	private _type: Variant;
	private _state: SaveState;
	private _stateData: AssetManager;

	constructor(assets: AssetManager, palette: ColorPalette, type: Variant) {
		this._currentData = assets;
		this._palette = palette;
		this._type = type;
	}

	get currentData(): AssetManager {
		return this._currentData;
	}

	get palette(): ColorPalette {
		return this._palette;
	}

	get type(): Variant {
		return this._type;
	}

	set state(state: SaveState) {
		this._state = state;
	}

	get state(): SaveState {
		return this._state;
	}

	set stateData(stateData: AssetManager) {
		this._stateData = stateData;
	}

	get stateData(): AssetManager {
		return this._stateData;
	}
}

export default DataManager;
