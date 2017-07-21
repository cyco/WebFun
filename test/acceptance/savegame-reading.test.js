import loadGameData from "test/helpers/game-data";
import { getFixtureContent } from "test/helpers/fixture-loading";
import { PrepareExpectations, ParseExpectation, ComparisonResult, CompareWorldItems } from "src/debug";
import ReadSaveGame from "src/engine/save-format";
import { InputStream } from "src/util";

let rawData = null;

xdescribe('SaveGame Reading', () => {
	console.log('SaveGame Reading');
	beforeAll((done) => {
		loadGameData(function (data) {
			rawData = data;
			done();
		});
	});

	it('can read save game files correctly', () => {
		let buffer = getFixtureContent('savegame_start.wld');
		let stream = new InputStream(buffer);
		const result = ReadSaveGame(stream);
		console.log(result);
	});
});
