import { Zone, Tile } from "src/engine/objects";
import { srand } from "src/util";
import { SimulatedStory } from "src/debug";
import { Story } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";

import { Parser, TestCase, Expectation, GameplayContext } from "src/debug/automation/test";
import loadGameData from "test/helpers/game-data";
import { Settings } from "src";

declare let withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;
const debug = false;

const run = (prefix: string, fileName: string, testFileContents: string): void => {
	describe(
		`WebFun.Acceptance.${prefix}.${fileName.replace(/[\./]*(.*)\.wftest/gi, "$1")}`,
		withTimeout(FiveMinutes, () => {
			const testCases = Parser.Parse(fileName, testFileContents);

			testCases.forEach(testCase => {
				const ctx = new GameplayContext(debug);
				describe(`${testCase.description}`, () => {
					beforeAll(async () => {
						await ctx.prepare(loadGameData);
						ctx.buildEngine();

						Settings.difficulty = testCase.configuration.difficulty;
						srand(testCase.configuration.seed);
						ctx.engine.persistentState.gamesWon = testCase.configuration.gamesWon;

						if (testCase.configuration.health) ctx.engine.hero.health = testCase.configuration.health;

						ctx.engine.inventory.removeAllItems();
						testCase.configuration.inventory.forEach(i =>
							ctx.engine.inventory.addItem(ctx.engine.assets.get(Tile, i))
						);
						await ctx.playStory(buildStory(testCase), testCase.input.split(" "), debug);
					});

					testCase.expectations.forEach((exp: Expectation) => exp.evaluate(ctx));

					afterAll(async () => await ctx.cleanup());

					function buildStory(testCase: TestCase) {
						if (testCase.configuration.zone >= 0) return buildSimulatedStory(testCase);

						return buildRealWorldStory(testCase);
					}

					function buildSimulatedStory(testCase: TestCase) {
						const engine = ctx.engine;
						const { findItem, npc, requiredItem1, requiredItem2, zone } = testCase.configuration;
						const t = (t: number) => (t < 0 ? null : engine.assets.get(Tile, t));
						const z = (z: number) => (z < 0 ? null : engine.assets.get(Zone, z));

						return new SimulatedStory(
							t(findItem),
							t(npc),
							t(requiredItem1),
							t(requiredItem2),
							z(zone),
							surroundingZones(z(zone)),
							engine.assets
						);
					}

					function buildRealWorldStory(testCase: TestCase) {
						const { seed, planet, size } = testCase.configuration;

						return new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
					}

					function surroundingZones(zone: Zone): Zone[] {
						srand(zone.id);
						return ctx.engine.assets
							.getFiltered(Zone, (z: Zone) => z !== zone && z.type === Zone.Type.Empty && z.planet === zone.planet)
							.slice()
							.shuffle();
					}
				});
			});
		})
	);
};

export default run;
