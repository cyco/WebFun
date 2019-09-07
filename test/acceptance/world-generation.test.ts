import {
	CompareSectors,
	ComparisonResult,
	ParseExpectation,
	PrepareExpectations
} from "src/debug/expectation";

import loadGameData from "test/helpers/game-data";
import { GameData, AssetManager, Story } from "src/engine";
import { Planet, WorldSize } from "../../src/engine/types";
import Worlds from "test/fixtures/worlds.txt";
import { Yoda } from "src/engine/type";
import { Tile, Zone, Puzzle, Char, Sound } from "src/engine/objects";

let rawData: any = null;

const compareItem = (actual: any, expected: any) => {
	const result = CompareSectors(actual, expected);
	if (result !== ComparisonResult.Different) return;

	if ((actual.zone ? actual.zone.id : -1) !== expected.zoneID)
		throw `Difference in zone ids detected! ${actual.zone ? actual.zone.id : -1} !== ${expected.zoneID}`;

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
			const assetManager = buildAssetManagerFromGameData();
			const story = new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
			story.generateWorld(assetManager);
			expect(() => compare(story, { seed, planet, size, world, dagobah })).not.toThrow();
			done();
		});
	});
};

function buildAssetManagerFromGameData() {
	const data = new GameData(rawData);
	const assetManager = new AssetManager();

	assetManager.populate(Zone, data.zones);
	assetManager.populate(Tile, data.tiles);
	assetManager.populate(Puzzle, data.puzzles);
	assetManager.populate(Char, data.characters);
	assetManager.populate(Sound, data.sounds);

	return assetManager;
}

describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async () => (rawData = await loadGameData(Yoda)));

	const maps = PrepareExpectations(Worlds).map(ParseExpectation);
	maps.forEach(runTest);
});
