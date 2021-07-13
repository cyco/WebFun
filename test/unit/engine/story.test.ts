import Story from "src/engine/story";
import { WorldSize } from "src/engine/generation";
import { srand } from "src/util";
import * as Generation from "src/engine/generation";
import { WorldGenerationError } from "src/engine/generation";
import Zone from "src/engine/objects/zone";
import { AssetManager, SaveState, Variant } from "src/engine";

describe("WebFun.Engine.Story", () => {
	let subject: Story;
	beforeEach(() => (subject = new Story(1, Zone.Planet.Hoth, WorldSize.Small)));
	it("is a simple container for seed, size and world size", () => {
		expect(subject.seed).toBe(1);
		expect(subject.planet).toBe(Zone.Planet.Hoth);
		expect(subject.size).toBe(WorldSize.Small);
	});

	describe("generating the world", () => {
		let assetsMock: AssetManager;
		let worldGeneratorMock: Generation.WorldGenerator;
		let dagobahGeneratorMock: Generation.DagobahGenerator;
		let variantMock: Variant;

		beforeEach(() => {
			variantMock = mockVariant();
			assetsMock = mockAssets();
			worldGeneratorMock = mockGenerator();
			dagobahGeneratorMock = mockDagobahGenerator();

			spyOn(Generation, "WorldGenerator").and.returnValue(worldGeneratorMock);
			spyOn(Generation, "DagobahGenerator").and.returnValue(dagobahGeneratorMock);
		});

		it("can generate the original world", () => {
			spyOn(worldGeneratorMock, "generate").and.returnValue(mockSaveState());
			subject.generateWorld(assetsMock, variantMock);

			expect(Generation.WorldGenerator).toHaveBeenCalledWith(
				subject.size,
				subject.planet,
				assetsMock,
				variantMock
			);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(subject.seed);
		});

		it("keeps generating worlds with varying seed until it succeeds", () => {
			srand(0);

			spyOn(worldGeneratorMock, "generate").and.callFake((seed: number): SaveState => {
				if (seed === 1) throw new WorldGenerationError();
				if (seed === 38) throw new WorldGenerationError();

				return mockSaveState();
			});

			subject.generateWorld(assetsMock, variantMock, 50);

			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(1);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(38);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(7719);
		});

		function mockVariant(): any {
			return {};
		}

		function mockAssets(): any {
			return {
				get() {
					return {};
				}
			};
		}

		function mockGenerator(): any {
			return {
				generate() {
					return mockSaveState();
				}
			};
		}

		function mockDagobahGenerator(): any {
			return {
				generate() {
					return { sectors: (100).times(_ => ({ zone: -1 })) };
				}
			};
		}

		function mockSaveState(): any {
			return {
				world: { sectors: (100).times(() => ({ zone: -1 })) },
				dagobah: { sectors: (100).times(_ => ({ zone: -1 })) },
				goalPuzzle: -1,
				puzzleIDs1: new Int16Array(1),
				puzzleIDs2: new Int16Array(1)
			};
		}
	});
});
