import { GameType, GameTypeYoda, GameTypeIndy, GameData, DataFileReader } from "src/engine";
import { FileLoader } from "src/util";
import Settings from "src/settings";

class DataProvider {
	private url: Map<GameType, string> = new Map<GameType, string>();

	constructor(
		yodaUrl: string = Settings.url.yoda.data,
		indyUrl: string = Settings.url.indy.data
	) {
		this.url.set(GameTypeYoda, yodaUrl);
		this.url.set(GameTypeIndy, indyUrl);
	}

	provide(type: GameType): Promise<GameData> {
		const url = this.url.get(type);
		return FileLoader.loadAsKaitaiStream(url)
			.then((stream: any) => new DataFileReader(stream))
			.then((rawData: any) => new GameData(rawData));
	}
}

export default DataProvider;
