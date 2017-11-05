import { ColorPalette, GameData } from "src/engine";
import TileSheet from "./tile-sheet";
import { ImageFactory } from "src/engine/rendering/canvas";

class DataManager {
	private _originalData: GameData;
	private _currentData: GameData;
	private _palette: ColorPalette;
	private _tileSheet: TileSheet;

	constructor(originalData: GameData, palette: ColorPalette) {
		this._originalData = originalData.copy();
		this._currentData = originalData.copy();
		this._palette = palette;
		this._tileSheet = new TileSheet(this._originalData.tiles.length);
		this._originalData.tiles.forEach(t => this._tileSheet.add(t._imageData));
		this._tileSheet.draw(new ImageFactory(palette));
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

	get tileSheet() {
		return this._tileSheet;
	}
}

export default DataManager;
