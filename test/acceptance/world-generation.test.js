import loadGameData from '../helpers/game-data';
import loadMapFixtures from '../helpers/map-fixture-parsing';

import Story from '/engine/story';
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

describe('World Generation', () => {
	beforeAll((done) => {
		loadGameData(function(data) {
			rawData = data;
			done();
		});
	});

	let worlds = loadMapFixtures('worlds.txt');
	for (let i = 0; i < worlds.length; i++) {
		let { seed, planet, size, data } = worlds[i];
		const world = worlds[i];
		it(`World 0x${seed.toString(0x10)} ${getPlanetName(planet)} ${getSizeName(size)}`, ((seed, planet, size, sample) => () => {
			// expect({ seed, planet, size, data: new GameData(rawData) }).toGenerateWorld(sample);
			window.logging = false;

			const story = new Story(seed, planet, size);
			story.generateWorld({data: new GameData(rawData)});
			
			const world = story._world;
			for (let i = 0; i < 100; i++) {
				let thing = world.index(i);
				expect(thing.zoneId).toBe(sample[i * 10]);
				expect(thing.zoneType).toBe(sample[i * 10 + 1]);

				if (thing.zoneId !== sample[i * 10]) return;
				if (thing.zoneType !== sample[i * 10 + 1]) return;
				// if (thing.findItemID !== sample[i * 10 + 6]) return;
				// if (thing.requiredItemID !== sample[i * 10 + 4]) return;
			}
			window.logging = false;
			return;
		})(seed, planet, size, data));
	}
});
