import loadGameData from '../helpers/game-data';
import loadMapFixtures from '../helpers/map-fixture-parsing';

import GameData from '/engine/game-data';
import WorldGenerator from '/engine/generation/world-generator';

let rawData = null;

function getSizeName(size) {
	if (size === 1) return "Small";
	if (size === 2) return "Medium";
	if (size === 3) return "Large";

	return "Invalid";
}

function getPlanetName(p) {
	if (p === 1) return "Tatooine";
	if (p === 2) return "Hoth";
	if (p === 3) return "Endor";
}

function testWorld({ seed, planet, size }, sample) {
	console.log('test world ', seed, planet, size);
	it(`World 0x${seed.toString(0x10)} ${getPlanetName(planet)} ${getSizeName(size)}`, () => {
		console.log('execute it');
		expect({ seed, planet, size, data: new GameData(rawData) }).toGenerateWorld(sample);
	});
}

describe('World Generation', function() {
	beforeAll((done) => {
		loadGameData(function(data) {
			rawData = data;
			done();
		});
	});

	let worlds = loadMapFixtures('worlds.txt');
	for (let i = 0; i < worlds.length; i++) {
		testWorld(worlds[i], worlds[i].data);
	}
});
