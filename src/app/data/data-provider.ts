import { GameData, GameType, GameTypeIndy, GameTypeYoda, readGameDataFile } from "src/engine";

import { FileLoader } from "src/util";
import Settings from "src/settings";

class DataProvider {
	private url: Map<GameType, string> = new Map<GameType, string>();

	constructor(yodaUrl: string = Settings.url.yoda.data, indyUrl: string = Settings.url.indy.data) {
		this.url.set(GameTypeYoda, yodaUrl);
		this.url.set(GameTypeIndy, indyUrl);
	}

	async provide(type: GameType): Promise<GameData> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);
		const rawData = readGameDataFile(stream, type);
		return new GameData(rawData);
	}
}

export default DataProvider;
