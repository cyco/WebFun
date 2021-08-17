import { Zone, Tile, Puzzle } from "src/engine/objects";
import { SimulatedStory } from "src/app/webfun/debug";
import { Story } from "src/engine";
import { WorldSize } from "src/engine/generation";

import {
	Parser,
	TestCase,
	Expectation,
	GameplayContext
} from "src/app/webfun/debug/automation/test";
import loadGameData from "test/helpers/game-data";
import { NullIfMissing } from "src/engine/asset-manager";
import { Yoda } from "src/variant";
import adjacentZones from "src/app/webfun/debug/components/test-creator/adjacent-zones";

declare let withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;
const debug = false;

const run = (prefix: string, fileName: string, testFileContents: string): void => {
	(fileName.endsWith(".fwftest")
		? fdescribe
		: fileName.endsWith(".xwftest")
		? xdescribe
		: describe)(
		`WebFun.Acceptance.${prefix}.${fileName.replace(/[\./]*(.*)\.(x|f)?wftest/gi, "$1")}`,
		withTimeout(FiveMinutes, () => {
			try {
				const testCases = Parser.Parse(fileName, testFileContents);

				testCases.forEach(testCase => {
					const ctx = new GameplayContext(debug);

					describe(`${testCase.description}`, () => {
						beforeAll(async () => {
							await ctx.prepare(loadGameData);
							ctx.buildEngine();
							ctx.engine.assets.get(Puzzle, Yoda.goalIDs.RESCUE_YODA).type = Puzzle.Type.Disabled;
							ctx.engine.assets.get(Puzzle, Yoda.goalIDs.CAR).type = Puzzle.Type.Disabled;

							ctx.engine.persistentState.gamesWon = testCase.configuration.gamesWon;
							ctx.engine.hero.health = testCase.configuration.health;
							ctx.settings.difficulty = testCase.configuration.difficulty;

							ctx.engine.inventory.removeAllItems();
							testCase.configuration.inventory.forEach(i =>
								ctx.engine.inventory.addItem(ctx.engine.assets.get(Tile, i))
							);
							await ctx.playStory(buildStory(testCase), testCase.input, debug);
						});

						testCase.expectations.forEach((exp: Expectation) => exp.evaluate(ctx));

						afterAll(async () => await ctx.cleanup());

						function buildStory(testCase: TestCase) {
							if (testCase.configuration.zone >= 0) return buildSimulatedStory(testCase);

							return buildRealWorldStory(testCase);
						}

						function buildSimulatedStory(testCase: TestCase): Story {
							const engine = ctx.engine;
							const { findItem, npc, requiredItem1, requiredItem2, zone } = testCase.configuration;
							const t = (t: number) => engine.assets.get(Tile, t, NullIfMissing);
							const z = (z: number) => engine.assets.get(Zone, z, NullIfMissing);

							const { seed } = testCase.configuration;
							const story = new SimulatedStory(
								t(findItem),
								t(npc),
								t(requiredItem1),
								t(requiredItem2),
								z(zone),
								adjacentZones(z(zone), engine.assets.getAll(Zone)),
								engine.assets
							);
							story.seed = seed;
							story.planet = Zone.Planet.None;
							story.size = WorldSize.Small;

							return story;
						}

						function buildRealWorldStory(testCase: TestCase): Story {
							const engine = ctx.engine;
							const { seed, planet, size } = testCase.configuration;

							const story = new Story(engine.assets, engine.variant);
							story.seed = seed;
							story.planet = Zone.Planet.fromNumber(planet);
							story.size = WorldSize.fromNumber(size);

							return story;
						}
					});
				});
			} catch (e) {
				console.warn(`Parsing test ${fileName} failed`);
				console.error(e);
			}
		})
	);
};

export default run;
