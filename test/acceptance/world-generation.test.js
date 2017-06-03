import loadGameData from '../helpers/game-data';
import { getFixtureContent } from '../helpers/fixture-loading';
import { PrepareExpectations, ParseExpectation, ComparisonResult, CompareWorldItems } from '/debug';

import Story from '/engine/story';
import GameData from '/engine/game-data';
import WorldGenerator from '/engine/generation/world-generator';

import using from 'jasmine-data-provider';

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

const compareItem = (actual, expected) => {
	const result = CompareWorldItems(actual, expected);
	if (result !== ComparisonResult.Different) return;

	if (actual.zoneID !== expected.zoneID) throw `Difference in zone ids detected! ${actual.zoneID} !== ${expected.zoneID}`;
	if (actual.zoneType !== expected.zoneType) throw `Difference in zone types detected! ${actual.zoneType} !== ${expected.zoneType}`;
	throw `Difference detected`;
};

const compare = (story, expectation) => {
	if (expectation.world === null && !story._reseeded) throw `Expected reseed!`;
	else if (expectation.world === null) return;

	/* main world */
	try {
		for (let i = 0; i < 100; i++) {
			compareItem(story.world.index(i), expectation.world[i]);
		}
	} catch (e) {
		throw `World: ${e}`;
	}

	/* dagobah */
	try {
		compareItem(story.dagobah.at(4, 4), expectation.dagobah[0]);
		compareItem(story.dagobah.at(5, 4), expectation.dagobah[1]);
		compareItem(story.dagobah.at(4, 5), expectation.dagobah[2]);
		compareItem(story.dagobah.at(5, 5), expectation.dagobah[3]);
	} catch (e) {
		throw `Dagobah: ${e}`;
	}
};

describe('World Generation', () => {
	beforeAll((done) => {
		loadGameData(function(data) {
			rawData = data;
			done();
		});
	});

	using(PrepareExpectations(getFixtureContent('../../game-data/worlds.txt')).map(ParseExpectation), ({ seed, planet, size, world, dagobah }) =>
		it(`World ${seed} ${getPlanetName(planet)} ${getSizeName(size)}`, () => {
			const story = new Story(seed, planet, size);
			story.generateWorld({ data: new GameData(rawData) });

			expect(() => compare(story, { seed, planet, size, world, dagobah })).not.toThrow();
		})
	);
});
