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
		fail(`Difference in zone ids detected! ${actual.zone ? actual.zone.id : -1} !== ${expected.zoneID}`);

	fail(`Difference detected`);
};

const compare = (story: Story, expectation: any) => {
	if (expectation.world === null && !(story as any)._reseeded) fail(`Expected reseed!`);
	else if (expectation.world === null) return;

	/* main world */
	for (let i = 0; i < 100; i++) {
		compareItem(story.world.at(i), expectation.world[i]);
	}

	/* dagobah */
	compareItem(story.dagobah.at(4, 4), expectation.dagobah[0]);
	compareItem(story.dagobah.at(5, 4), expectation.dagobah[1]);
	compareItem(story.dagobah.at(4, 5), expectation.dagobah[2]);
	compareItem(story.dagobah.at(5, 5), expectation.dagobah[3]);
};

const runTest = ({ seed, planet, size, world, dagobah }: any) => {
	describe(`World ${seed} ${planet.toString()} ${size.toString()}`, () => {
		it("is generated correctly", () => {
			const assets = buildAssetManagerFromGameData();
			const story = new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
			story.generateWorld(assets);
			compare(story, { seed, planet, size, world, dagobah });
		});
	});
};

function buildAssetManagerFromGameData() {
	const data = new GameData(rawData);
	const assets = new AssetManager();

	assets.populate(Zone, data.zones);
	assets.populate(Tile, data.tiles);
	assets.populate(Puzzle, data.puzzles);
	assets.populate(Char, data.characters);
	assets.populate(Sound, data.sounds);

	return assets;
}

describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async () => (rawData = await loadGameData(Yoda)));

	const maps = PrepareExpectations(Worlds).map(ParseExpectation);
	maps.forEach(runTest);
});
