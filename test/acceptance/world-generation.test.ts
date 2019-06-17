import {
	CompareWorldItems,
	ComparisonResult,
	ParseExpectation,
	PrepareExpectations
} from "src/debug/expectation";

import loadGameData from "test/helpers/game-data";
import GameData from "../../src/engine/game-data";
import Story from "../../src/engine/story";
import { Planet, WorldSize } from "../../src/engine/types";
import Worlds from "test/fixtures/worlds.txt";
import { Yoda } from "src/engine/type";

let rawData: any = null;

const compareItem = (actual: any, expected: any) => {
	const result = CompareWorldItems(actual, expected);
	if (result !== ComparisonResult.Different) return;

	if ((actual.zone ? actual.zone.id : -1) !== expected.zoneID)
		throw `Difference in zone ids detected! ${actual.zone ? actual.zone.id : -1} !== ${expected.zoneID}`;
	// if (actual.zoneType.rawValue !== expected.zoneType) throw `Difference in zone types detected! ${actual.zoneType.rawValue} !== ${expected.zoneType}`;
	throw `Difference detected`;
};

const compare = (story: Story, expectation: any) => {
	if (expectation.world === null && !(story as any)._reseeded) throw `Expected reseed!`;
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

const runTest = ({ seed, planet, size, world, dagobah }: any) => {
	describe(`World ${seed} ${planet.toString()} ${size.toString()}`, () => {
		it("is generated correctly", done => {
			const story = new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
			story.generateWorld(new GameData(rawData));
			expect(() => compare(story, { seed, planet, size, world, dagobah })).not.toThrow();
			done();
		});
	});
};

describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async done => {
		try {
			rawData = await loadGameData(Yoda);
		} catch (e) {
			console.error(e);
		} finally {
			done();
		}
	});

	const maps = PrepareExpectations(Worlds).map(ParseExpectation);
	maps.forEach(runTest);
});
