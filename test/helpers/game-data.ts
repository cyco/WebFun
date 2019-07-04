import { getFixtureData } from "./fixture-loading";
import { readGameDataFile, GameTypeYoda, GameType } from "src/engine";
import { InputStream } from "src/util";
import { Data } from "src/engine/file-format";

export default (type: GameType, path?: string): Promise<Data> => {
	return new Promise(async resolve => {
		const file = path ? path : type === GameTypeYoda ? "yoda.data" : "indy.data";
		const contents = await getFixtureData(file);

		if (!contents) {
			console.warn(`Game data could not be found.`);
			resolve(null);
			return;
		}

		const stream = new InputStream(contents);
		const result = readGameDataFile(stream, type);
		resolve(result);
	});
};
