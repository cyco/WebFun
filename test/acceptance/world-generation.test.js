import loadGameData from '../helpers/game-data';
import loadMapFixtures from '../helpers/map-fixture-parsing';

import GameData from '/engine/game-data';
import WorldGenerator from '/engine/generation/world-generator';

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

describe('World Generation', function() {
	let data = null;
	let rawData = null;

	beforeAll((done) => {
		loadGameData(function(data) {
			rawData = data;
			done();
		});
	});

	beforeEach(function() {
		data = new GameData(rawData);
	});

	let worlds = loadMapFixtures('worlds.txt');
	for (let i = 0; i < worlds.length; i++) {
		let world = worlds[i];
		let seed = world.seed;
		let size = world.size;
		let planet = world.planet;

		it('World 0x' + seed.toString(0x10) + " " + getPlanetName(planet) + " " + getSizeName(size),
			(function(world) {
				return function() {
					window.logging = false;
					let seed = world.seed;
					let planet = world.planet;
					let size = world.size;
					let sample = world.data;
					let worldGenerator = new WorldGenerator(seed, size, planet, { data });
					worldGenerator.generate();

					let i;
					for (i = 0; i < 100; i++) {
						let thing = worldGenerator.world[i];
						expect(thing.zoneID).toBe(sample[i * 10]);
//						expect(thing.zoneType).toBe(sample[i * 10 + 1]);
						
						if (thing.zoneID !== sample[i * 10]) return;
						if (thing.zoneType !== sample[i * 10 + 1]) return;
						// if (thing.findItemID !== sample[i * 10 + 6]) return;
						// if (thing.requiredItemID !== sample[i * 10 + 4]) return;
					}
					window.logging = false;
				};
			})(world));
	}
});
