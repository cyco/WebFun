import { GameData } from "src/engine";

class DataManager {
	private _originalData: GameData;

	constructor(originalData: GameData) {
		this._originalData = originalData;
	}

	write(data: GameData, target: ArrayBuffer): number {
		return 0;
	}
}

export default DataManager;
