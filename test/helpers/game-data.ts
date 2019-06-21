import { getFixtureData } from "./fixture-loading";
import { readGameDataFile, GameTypeYoda, GameType } from "src/engine";
import { InputStream } from "src/util";
import { Data } from "src/engine/file-format";

export default (type: GameType, callback?: (data: Data) => void): Promise<Data> => {
	return new Promise(async resolve => {
		const file = type === GameTypeYoda ? "yoda.data" : "indy.data";
		const contents = await getFixtureData(file);

		if (!contents) {
			console.warn(`Game data could not be found.`);
			callback && callback(null);
			resolve(null);
			return;
		}

		const stream = new InputStream(contents);
		const result = readGameDataFile(stream, type);
		callback && callback(result);
		resolve(result);
	});
};
