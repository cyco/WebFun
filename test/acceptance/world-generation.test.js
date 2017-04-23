import loadGameData from '../helpers/game-data';
import { getFixtureContent } from '../helpers/fixture-loading';
import { PrepareExpectations, ParseExpectation, ComparisonResult, CompareWorldItems } from '/debug';

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

console.log('world generation executed');
describe('World Generation', () => {
	beforeAll((done) => {
		loadGameData(function(data) {
			rawData = data;
			done();
		});
	});

	let expectations = PrepareExpectations(getFixtureContent('worlds.txt'));
	for (let i = 0; i < expectations.length; i++) {
		let { seed, planet, size, world, dagobah } = ParseExpectation(expectations[i]);
		if (seed === -1) {
			console.warn('expectation', i, 'is broken');
			continue;
		}

		it(`World ${seed} ${getPlanetName(planet)} ${getSizeName(size)}`,
			((seed, planet, size, expectedWorld, expectedDagobah) => () => {
				window.logging = false;

				const story = new Story(seed, planet, size);
				story.generateWorld({ data: new GameData(rawData) });

				for (let i = 0; i < 100; i++) {
					const result = CompareWorldItems(story._world.index(i), expectedWorld[i]);
					expect(result).toBe(ComparisonResult.Equal);
					if (result !== ComparisonResult.Equal) break;
				}
				window.logging = false;
			})(seed, planet, size, world, dagobah));
	}
});
