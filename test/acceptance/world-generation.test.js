import { CompareWorldItems, ComparisonResult, ParseExpectation, PrepareExpectations } from "src/debug/expectation";

import loadGameData from "test-helpers/game-data";
import { getFixtureContent } from "test-helpers/fixture-loading";
import Story from "../../src/engine/story";
import GameData from "../../src/engine/game-data";
import WorldSize from "../../src/engine/types/world-size";

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

const runTest = ({seed, planet, size, world, dagobah}) => {
	describe(`World ${seed} ${getPlanetName(planet)} ${getSizeName(size)}`, () => {
		it("is generated correctly", (done) => {
			const story = new Story(seed, planet, WorldSize.fromNumber(size));
			story.generateWorld({data: new GameData(rawData)});
			expect(() => compare(story, {seed, planet, size, world, dagobah})).not.toThrow();
			done();
		});
	});
};

const runnerFilter = (map) => {
	const values = process.acceptance;
	if (values.seed !== undefined && map.seed !== values.seed) {
		return false;
	}

	if (values.planet !== undefined && map.planet !== values.planet) {
		return false;
	}

	if (values.size !== undefined && map.size !== values.size) {
		return false;
	}

	return true;
};
const identity = (i) => i;

describe("World Generation", () => {
	beforeAll((done) => {
		loadGameData(data => {
			rawData = data;
			done();
		});
	});

	const worldsFixture = getFixtureContent("worlds.txt");
	const maps = PrepareExpectations(worldsFixture).map(ParseExpectation).filter(process.acceptance ? runnerFilter : identity);
	maps.forEach(runTest);
});
