import { readGameDataFile, Variant } from "src/engine";
import { Data } from "src/engine/file-format";

import { FileLoader } from "src/util";
import { Indy, Yoda } from "src/variant";

class DataProvider {
	private url: Map<Variant, string> = new Map<Variant, string>();

	constructor(
		yodaUrl: string = JSON.parse(process.env["WEBFUN_GAMES"])[0].data,
		indyUrl: string = JSON.parse(process.env["WEBFUN_GAMES"])[4].data
	) {
		this.url.set(Yoda, yodaUrl);
		this.url.set(Indy, indyUrl);
	}

	async provide(type: Variant): Promise<Data> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);
		const rawData = readGameDataFile(stream, type);
		return rawData;
	}
}

export default DataProvider;
