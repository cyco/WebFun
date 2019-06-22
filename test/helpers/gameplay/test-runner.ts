import GameplayContext from "./gameplay-runner";
import { Zone, Tile } from "src/engine/objects";
import { srand } from "src/util";
import { SimulatedStory } from "src/debug";
import { Story } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";

import {
	Parser,
	TestCase,
	Expectation,
	NOPExpectation,
	InventoryContainsExpectation,
	UnknownExpectation,
	ZoneSolvedExpectation
} from "src/debug/automation/test";

declare var withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;

const run = (prefix: string, fileName: string, testFileContents: string) => {
	describe(
		`WebFun.Acceptance.${prefix}.${fileName}`,
		withTimeout(FiveMinutes, () => {
			const ctx = new GameplayContext(true);
			const parser = new Parser();
			const testCase = parser.parse(fileName, testFileContents);

			beforeAll(async done => {
				try {
					await ctx.prepare();
					ctx.buildEngine();

					srand(testCase.configuration.seed);
					ctx.engine.persistentState.gamesWon = testCase.configuration.gamesWon;
					await ctx.playStory(buildStory(testCase), testCase.input.split(" "), true);
				} catch (e) {
					console.warn("e", e);
				} finally {
					done();
				}
			});

			testCase.expectations.forEach((exp: Expectation) => {
				if (exp instanceof NOPExpectation) {
					it("does nothing, really", (): void => void 0);
				} else if (exp instanceof InventoryContainsExpectation) {
					it(`hero has items ${exp.items.map(i => i.toHex(3)).join(", ")}`, () => {
						exp.items.forEach(i => expect(ctx.engine.inventory.contains(i)).toBe(true));
					});
				} else if (exp instanceof ZoneSolvedExpectation) {
					it("the zone is solved", () => {
						expect(ctx.engine.currentWorld.at(4, 4).zone.solved).toBeTrue();
					});
				} else if (exp instanceof UnknownExpectation) {
					console.warn(`Don\'t know how to handle expectation ${exp.line}`);
				}
			});

			afterAll(async done => {
				try {
					await ctx.cleanup();
				} catch (e) {
					console.error("cleanup failed", e);
				} finally {
					done();
				}
			});

			function buildStory(testCase: TestCase) {
				if (testCase.configuration.zone >= 0) return buildSimulatedStory(testCase);

				return buildRealWorldStory(testCase);
			}

			function buildSimulatedStory(testCase: TestCase) {
				const engine = ctx.engine;
				const { findItem, puzzleNPC, requiredItem1, requiredItem2, zone } = testCase.configuration;
				const t = (t: number) => (t < 0 ? null : engine.assetManager.get(Tile, t));
				const z = (z: number) => (z < 0 ? null : engine.assetManager.get(Zone, z));

				return new SimulatedStory(
					t(findItem),
					t(puzzleNPC),
					t(requiredItem1),
					t(requiredItem2),
					z(zone),
					surroundingZones(z(zone)),
					engine.assetManager.getAll(Zone)
				);
			}

			function buildRealWorldStory(testCase: TestCase) {
				const { seed, planet, size } = testCase.configuration;

				return new Story(seed, Planet.fromNumber(planet), WorldSize.fromNumber(size));
			}

			function surroundingZones(zone: Zone): Zone[] {
				srand(zone.id);
				return ctx.engine.assetManager
					.getFiltered(
						Zone,
						(z: Zone) => z !== zone && z.type === Zone.Type.Empty && z.planet === zone.planet
					)
					.slice()
					.shuffle();
			}
		})
	);
};

export default run;
