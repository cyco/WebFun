import Story from "src/engine/story";
import { WorldSize } from "src/engine/generation";
import { srand } from "src/util";
import * as Generation from "src/engine/generation";
import { WorldGenerationError } from "src/engine/generation";
import Zone from "src/engine/objects/zone";
import { AssetManager, SaveState, Variant } from "src/engine";
import * as EngineModule from "src/engine";

xdescribe("WebFun.Engine.Story", () => {
	let subject: Story;

	beforeEach(() => {
		subject = new Story(mockAssets(), mockVariant());
		spyOn(subject as any, "_setupDagobah");
		spyOn(subject as any, "_setupWorld");
	});

	it("is a simple container for seed, size and world size", () => {
		subject.generate(1, Zone.Planet.Hoth, WorldSize.Small);

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

		it("can generate an original world", () => {
			const state = mockSaveState();
			spyOn(worldGeneratorMock, "generate").and.returnValue(true);
			spyOn(EngineModule, "SaveState").and.returnValues(state);
			subject.generate(0, Zone.Planet.Hoth, WorldSize.Small);

			expect(Generation.WorldGenerator).toHaveBeenCalledWith(assetsMock, variantMock);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(state);
		});

		it("keeps generating worlds with varying seed until it succeeds", () => {
			srand(0);

			spyOn(worldGeneratorMock, "generate").and.callFake((state: SaveState): boolean => {
				if (state.seed === 1) throw new WorldGenerationError();
				if (state.seed === 38) throw new WorldGenerationError();

				return true;
			});

			subject.generate(0, Zone.Planet.Hoth, WorldSize.Small, 50);

			expect(worldGeneratorMock.generate).toHaveBeenCalledTimes(3);
		});
	});

	function mockVariant(): any {
		return {};
	}

	function mockAssets(): any {
		return {
			get() {},
			getAll(): any[] {
				return [];
			},
			getFiltered(): any[] {
				return [];
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
			puzzleIDs2: new Int16Array(1),
			hotspots: new Map(),
			zones: new Map()
		};
	}
});
