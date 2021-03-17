import { GameData, readGameDataFile, Variant } from "src/engine";

import { FileLoader } from "src/util";
import Settings from "src/settings";
import { Indy, Yoda } from "src/variant";

class DataProvider {
	private url: Map<Variant, string> = new Map<Variant, string>();

	constructor(yodaUrl: string = Settings.url.yoda.data, indyUrl: string = Settings.url.indy.data) {
		this.url.set(Yoda, yodaUrl);
		this.url.set(Indy, indyUrl);
	}

	async provide(type: Variant): Promise<GameData> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);
		const rawData = readGameDataFile(stream, type);
		return new GameData(rawData);
	}
}

export default DataProvider;
