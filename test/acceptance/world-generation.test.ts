import { ParseExpectation, PrepareExpectations } from "src/app/webfun/debug/expectation";

import loadGameData from "test/helpers/game-data";
import { GameData, AssetManager, Story, SaveGameWriter } from "src/engine";
import { WorldSize } from "src/engine/generation";
import Worlds from "test/fixtures/worlds.txt";
import { Yoda } from "src/variant";
import { Tile, Zone, Puzzle } from "src/engine/objects";
import Sector from "src/engine/sector";
import { WorldGenerationError } from "src/engine/generation";
import { floor } from "src/std/math";
import { DiscardingOutputStream, download, InputStream, OutputStream } from "src/util";
import { Reader, Writer } from "src/engine/save-game";
import diff, { Differences, DifferenceType } from "src/util/diff";

let assets: AssetManager = null;

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
			`Required item ${id(actual.requiredItem)} in sector ${pos.x}x${
				pos.y
			} is not ${requiredItemID}`
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
	if (story.world === null && expectation.world !== null)
		return fail("Expected a successful world but found reseed");
	if (story.world !== null && expectation.world === null) return fail("Expected a reseed");
	if (story.world === null && expectation.world === null) return;

	for (let i = 0; i < 100; i++) {
		compareSector({ x: i % 10, y: floor(i / 10) }, story.world.at(i), expectation.world[i]);
	}
};

const runTest = ({ seed, planet, size, world, dagobah }: any) => {
	if (seed === -1) return;

	describe(`World ${seed} ${planet.toString()} ${size.toString()}`, () => {
		it("is generated correctly", async () => {
			try {
				const story = new Story(assets, Yoda);
				story.generate(seed, Zone.Planet.fromNumber(planet), WorldSize.fromNumber(size), 1);

				compare(story, { seed, planet, size, world, dagobah });
			} catch (e) {
				if (e instanceof WorldGenerationError) {
					compare(
						{ seed, planet, size, world: null, dagobah: null },
						{ seed, planet, size, world, dagobah }
					);
				} else return fail(e);
			}
		});
	});
};

function printDifferences(differences: Differences, a: any, b: any): void {
	let out = "\n";
	for (const difference of differences) {
		const c =
			difference.type === DifferenceType.Added
				? "+"
				: difference.type === DifferenceType.Deleted
				? "-"
				: "~";

		const left =
			difference.type === DifferenceType.Deleted || difference.type === DifferenceType.Updated
				? JSON.stringify(
						difference.key.reduce((acc, k) => (acc instanceof Map ? acc.get(k) : acc[k]), a)
				  )
				: "";

		const right =
			difference.type === DifferenceType.Added || difference.type === DifferenceType.Updated
				? JSON.stringify(
						difference.key.reduce((acc, k) => (acc instanceof Map ? acc.get(k) : acc[k]), b)
				  )
				: "";

		out += `${c} ${difference.key.join(".").padStart(20, " ")}  ${left} ${right}\n`;
	}

	if (out.trim()) {
		console.log(out);
	}
}

describe("WebFun.Acceptance.World Generation", () => {
	beforeAll(async () => {
		const rawData = await loadGameData(Yoda);
		const data = new GameData(rawData);
		assets = new AssetManager();

		assets.populate(Zone, data.zones);
		assets.populate(Tile, data.tiles);
		assets.populate(Puzzle, data.puzzles);
	});

	PrepareExpectations(Worlds).sort().map(ParseExpectation).forEach(runTest);

	it("generates the initial state correctly", async () => {
		const story = new Story(assets, Yoda);
		story.generate(0, Zone.Planet.Tatooine, WorldSize.Large, 1);

		const lenStream = new DiscardingOutputStream();
		const writer = new Writer();
		writer.write(story.state, lenStream);
		const stream = new OutputStream(lenStream.offset);
		writer.write(story.state, stream);

		const { read: read1 } = Reader.build(new InputStream(stream.buffer));
		const state = await read1(assets);

		const saveData = await getFixtureData("save-games/yoda-0-1-3.wld");
		const saveStream = new InputStream(saveData);
		const { read } = Reader.build(saveStream);
		const baseline = read(assets);

		printDifferences(diff(baseline, state), baseline, state);
		expect(diff(baseline, state)).toBeEmptyArray();
	});

	afterAll(() => {
		assets = null;
	});
});
