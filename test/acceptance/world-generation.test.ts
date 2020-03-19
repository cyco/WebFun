import { ParseExpectation, PrepareExpectations } from "src/debug/expectation";

import loadGameData from "test/helpers/game-data";
import { GameData, AssetManager, Story } from "src/engine";
import { Planet, WorldSize } from "../../src/engine/types";
import Worlds from "test/fixtures/worlds.txt";
import { Yoda } from "src/engine/type";
import { Tile, Zone, Puzzle } from "src/engine/objects";
import Sector from "src/engine/sector";
import { WorldGenerationError } from "src/engine/generation";
import { floor } from "src/std/math";

let rawData: any = null;

const compareSector = (pos: { x: number; y: number }, actual: Sector, expected: number[]) => {
	const id = (thing: any) => (thing ? thing.id : -1);
	const [
		zoneID,
		sectorField6,
		zoneType,
		puzzleIndex,
		requiredItemID,
		additionalRequiredItemID,
		findItemID,
		additionalGainItem,
		npcID,
		sectorField1A,
		visited,
		solved3,
		solved1,
		solved2,
		solved4,
		usedAlternateStrain,
		sectorField32
	] = expected;

	if (zoneID !== id(actual.zone)) {
		return fail(`Zone id is not ${zoneID}`);
	}

	if (zoneID === -1) return;

	if (
		zoneType !== (actual.zone ? actual.zone.type.rawValue : -1) &&
		// treat FindUniqueWeapon type as just find
		(zoneType !== 17 || (actual.zone ? actual.zone.type.rawValue : -1) !== 18)
	) {
		return fail(
			`Expected ${actual.zone.type.rawValue} (${actual.zone.type.name}) in sector ${pos.x}x${pos.y} to be ${zoneType}`
		);
	}

	if (npcID !== id(actual.npc)) {
		return fail(`Zone id in sector ${pos.x}x${pos.y} is not ${npcID}`);
	}

	if (puzzleIndex !== actual.puzzleIndex) {
		return fail(
			`Expected puzzle index ${actual.puzzleIndex} in sector ${pos.x}x${pos.y} to be ${puzzleIndex}`
		);
	}

	if (puzzleIndex !== -1 && actual.usedAlternateStrain !== !!usedAlternateStrain) {
		return fail(
			`Expected puzzle in sector ${pos.x}x${pos.y} to reference ${
				usedAlternateStrain ? "alternate" : "main"
			} strain`
		);
	}

	if (findItemID !== id(actual.findItem)) {
		return fail(`Find item in sector ${pos.x}x${pos.y} is not ${findItemID}`);
	}

	if (additionalGainItem !== id(actual.additionalGainItem)) {
		return fail(
			`Additional find item ${id(actual.additionalGainItem)} in sector ${pos.x}x${
				pos.y
			} is not ${additionalGainItem}`
		);
	}

	if (requiredItemID !== id(actual.requiredItem)) {
		return fail(
			`Required item ${id(actual.requiredItem)} in sector ${pos.x}x${pos.y} is not ${requiredItemID}`
		);
	}

	if (additionalRequiredItemID !== id(actual.additionalRequiredItem)) {
		return fail(
			`Additional required item ${id(actual.additionalRequiredItem)} in sector ${pos.x}x${
				pos.y
			} is not ${additionalRequiredItemID}`
		);
	}

	// assert static values
	if (visited !== -1 && visited !== 0) {
		return fail(`Unexpected value in visited in sector ${pos.x}x${pos.y}`);
	}

	if (solved1 !== -1 && solved1 !== 0) {
		return fail(`Unexpected value in solved1 in sector ${pos.x}x${pos.y}`);
	}

	if (solved2 !== -1 && solved2 !== 0) {
		return fail(`Unexpected value in solved2 in sector ${pos.x}x${pos.y}`);
	}

	if (solved3 !== -1 && solved3 !== 0) {
		return fail(`Unexpected value in solved3 in sector ${pos.x}x${pos.y}`);
	}

	if (solved4 !== -1 && solved4 !== 0) {
		return fail(`Unexpected value in solved4 in sector ${pos.x}x${pos.y}`);
	}

	if (sectorField6 !== 0xbaad) {
		return fail(`Unexpected value in field6 in sector ${pos.x}x${pos.y}`);
	}

	if (sectorField1A !== 0xbaad) {
		return fail(`Unexpected value in sectorField1A in sector ${pos.x}x${pos.y}`);
	}

	if (sectorField32 !== 0xbaad) {
		return fail("Unexpected value in field32");
	}
};

const compare = (story: any, expectation: any) => {
	if (!story.world || !expectation.world) return;
	if (story.world === null && expectation.world !== null)
		return fail("Expected a successfull world but found reseed");
	if (story.world !== null && expectation.world === null) return fail("Expected a reseed");
	if (story.world === null && expectation.world === null) return;

	/* main world */
	for (let i = 0; i < 100; i++) {
		compareSector({ x: i % 10, y: floor(i / 10) }, story.world.at(i), expectation.world[i]);
	}

	/* dagobah */
	/*
	compareSector({ x: 4, y: 4 }, story.dagobah.at(4, 4), expectation.dagobah[0]);
	compareSector({ x: 5, y: 4 }, story.dagobah.at(5, 4), expectation.dagobah[1]);
	compareSector({ x: 4, y: 5 }, story.dagobah.at(4, 5), expectation.dagobah[2]);
	compareSector({ x: 5, y: 5 }, story.dagobah.at(5, 5), expectation.dagobah[3]);#
	*/
};

const runTest = ({ seed, planet, size, world, dagobah }: any) => {
	if (seed === -1) return;

	describe(`World ${seed} ${planet.toString()} ${size.toString()}`, () => {
		it("is generated correctly", () => {
			try {
				const assets = buildAssetManagerFromGameData();
				const story = new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
				story.generateWorld(assets, 0, 0);
				compare(story, { seed, planet, size, world, dagobah });
			} catch (e) {
				if (e instanceof WorldGenerationError && e.message === "Too many reseeds") {
					compare(
						{ seed, planet, size, world: null, dagobah: null },
						{ seed, planet, size, world, dagobah }
					);
				} else return fail(e);
			}
		});
	});
};

function buildAssetManagerFromGameData() {
	const data = new GameData(rawData);
	const assets = new AssetManager();

	assets.populate(Zone, data.zones);
	assets.populate(Tile, data.tiles);
	assets.populate(Puzzle, data.puzzles);

	return assets;
}

describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async () => (rawData = await loadGameData(Yoda)));

	PrepareExpectations(Worlds)
		.sort()
		.map(ParseExpectation)
		.forEach(runTest);
});
