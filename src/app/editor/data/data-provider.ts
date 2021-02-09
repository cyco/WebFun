import { GameData, Variant, VariantIndy, VariantYoda, readGameDataFile } from "src/engine";

import { FileLoader } from "src/util";
import Settings from "src/settings";

class DataProvider {
	private url: Map<Variant, string> = new Map<Variant, string>();

	constructor(yodaUrl: string = Settings.url.yoda.data, indyUrl: string = Settings.url.indy.data) {
		this.url.set(VariantYoda, yodaUrl);
		this.url.set(VariantIndy, indyUrl);
	}

	async provide(type: Variant): Promise<GameData> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);
		const rawData = readGameDataFile(stream, type);
		return new GameData(rawData);
	}
}

export default DataProvider;
