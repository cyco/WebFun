import { ColorPalette, GameData } from "src/engine";
import CSSTileSheet from "./css-tile-sheet";
import { ImageFactory } from "src/engine/rendering/canvas";

class DataManager {
	private _data: GameData;
	private _currentData: GameData;
	private _palette: ColorPalette;
	private _tileSheet: CSSTileSheet;

	constructor(data: GameData, palette: ColorPalette, tilesheet: CSSTileSheet) {
		this._data = data.copy();
		this._currentData = data.copy();
		this._palette = palette;
		this._tileSheet = tilesheet;
	}

	get currentData() {
		return this._currentData;
	}

	get palette() {
		return this._palette;
	}

	get tileSheet() {
		return this._tileSheet;
	}
}

export default DataManager;
