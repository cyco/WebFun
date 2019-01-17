import {
	CompareWorldItems,
	ComparisonResult,
	ParseExpectation,
	PrepareExpectations
} from "src/debug/expectation";
import { getFixtureContent } from "test-helpers/fixture-loading";

import loadGameData from "test-helpers/game-data";
import GameData from "../../src/engine/game-data";
import Story from "../../src/engine/story";
import { Planet, WorldSize } from "../../src/engine/types";
import Worlds from "test-fixtures/worlds.txt";
import { Yoda } from "src/engine/type";

let rawData = null;

const compareItem = (actual, expected) => {
	const result = CompareWorldItems(actual, expected);
	if (result !== ComparisonResult.Different) return;

	if ((actual.zone ? actual.zone.id : -1) !== expected.zoneID)
		throw `Difference in zone ids detected! ${actual.zone ? actual.zone.id : -1} !== ${expected.zoneID}`;
	// if (actual.zoneType.rawValue !== expected.zoneType) throw `Difference in zone types detected! ${actual.zoneType.rawValue} !== ${expected.zoneType}`;
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

const runTest = ({ seed, planet, size, world, dagobah }) => {
	describe(`World ${seed} ${planet.toString()} ${size.toString()}`, () => {
		it("is generated correctly", done => {
			const story = new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
			story.generateWorld({ data: new GameData(rawData) });
			expect(() => compare(story, { seed, planet, size, world, dagobah })).not.toThrow();
			done();
		});
	});
};

const runnerFilter = map => {
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
const identity = (i, idx) => idx === 0;
describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async done => {
		rawData = await loadGameData(Yoda);
		done();
	});

	const maps = PrepareExpectations(Worlds)
		.map(ParseExpectation)
		.filter(process.acceptance ? runnerFilter : identity);
	maps.forEach(runTest);

	/* generate all maps
	for (let seed = 0; seed <= 0xffff; seed++) {
		+(function(seed) {
			it("generates " + seed.toString() + " for coverage", () => {
				if ([529, 8076, 56999, 63300].contains(seed)) {
					console.log("skip " + seed.toString());
					return;
				}
				const story = new Story(seed, Planet.ENDOR, WorldSize.Large);
				story.generateWorld({ data: new GameData(rawData) });
				expect(true).toBe(true);
			});
		})(seed);
	}
	//*/
});
