import loadGameData from '../helpers/game-data';
import { getFixtureContent } from '../helpers/fixture-loading';
import { PrepareExpectations, ParseExpectation, ComparisonResult, CompareWorldItems } from '/debug';
import ReadSaveGame from '/engine/save-format';
import GameData from '/engine/game-data';
import { InputStream } from '/util';

let rawData = null;

describe('SaveGame Reading', () => {
	beforeAll((done) => {
		loadGameData(function(data) {
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
