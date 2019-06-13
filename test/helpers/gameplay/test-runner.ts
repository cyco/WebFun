import TestFileParser from "./test-file-parser";
import TestCase from "./test-case";
import GameplayContext from "./gameplay-runner";
import TestExpectation from "./test-expectation";
import { NOPExpectation, InventoryContainsExpectation, UnknownExpectation } from "./expectations";
import { Zone } from "src/engine/objects";
import { srand } from "src/util";
import { SimulatedStory } from "src/debug";

declare var withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;

const run = (fileName: string, testFileContents: string) => {
	describe(
		`WebFun.Simulation.${fileName}`,
		withTimeout(FiveMinutes, () => {
			const ctx = new GameplayContext();
			const parser = new TestFileParser();
			const testCase = parser.parse(fileName, testFileContents);

			beforeAll(async done => {
				try {
					await ctx.prepare();
					ctx.buildEngine();

					srand(testCase.configuration.seed);
					await ctx.playStory(
						testCase.configuration.seed,
						buildStory(testCase),
						testCase.input.split(""),
						false
					);
				} catch (e) {
					console.warn("e", e);
				}

				done();
			});

			testCase.expectations.forEach((exp: TestExpectation) => {
				if (exp instanceof NOPExpectation) {
					it("does nothing, really", (): void => void 0);
				} else if (exp instanceof InventoryContainsExpectation) {
					it(`hero has items ${exp.items.map(i => i.toHex(3)).join(", ")}`, () => {
						exp.items.forEach(i => expect(ctx.engine.inventory.contains(i)).toBe(true));
					});
				} else if (exp instanceof UnknownExpectation) {
					console.warn(`Don\'t know how to handle expectation ${exp.line}`);
				}
			});

			afterAll(async done => {
				await ctx.cleanup();
				done();
			});

			function buildStory(testCase: TestCase) {
				const engine = ctx.engine;
				const { findItem, puzzleNPC, requiredItem1, requiredItem2, zone } = testCase.configuration;
				const t = (t: number) => (t < 0 ? null : engine.data.tiles[t]);
				const z = (z: number) => (z < 0 ? null : engine.data.zones[z]);

				return new SimulatedStory(
					t(findItem),
					t(puzzleNPC),
					t(requiredItem1),
					t(requiredItem2),
					z(zone),
					surroundingZones(z(zone)),
					engine.data.zones
				);
			}

			function surroundingZones(zone: Zone): Zone[] {
				const zones = ctx.engine.data.zones.slice();
				srand(zone.id);
				return zones
					.filter((z: Zone) => z !== zone && z.type === Zone.Type.Empty && z.planet === zone.planet)
					.shuffle();
			}
		})
	);
};

export default run;
