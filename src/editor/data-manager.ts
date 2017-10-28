import { ColorPalette, GameData } from "src/engine";

class DataManager {
	private _originalData: GameData;
	private _currentData: GameData;
	private _palette: ColorPalette;

	constructor(originalData: GameData, palette: ColorPalette) {
		this._originalData = originalData.copy();
		this._currentData = originalData.copy();
		this._palette = palette;
	}

	write(data: GameData, target: ArrayBuffer): number {
		return 0;
	}

	get originalData() {
		return this._originalData;
	}

	get currentData() {
		return this._currentData;
	}

	get palette() {
		return this._palette;
	}
}

export default DataManager;
