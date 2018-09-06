import Story from "src/engine/story";
import { Planet, WorldSize } from "src/engine/types";
import { srand } from "src/util";
import * as Generation from "src/engine/generation";

describe("Story", () => {
	let subject;
	beforeEach(() => (subject = new Story(1, Planet.HOTH, WorldSize.Small)));
	it("is a simple container for seed, size and world size", () => {
		expect(subject.seed).toBe(1);
		expect(subject.planet).toBe(Planet.HOTH);
		expect(subject.size).toBe(WorldSize.Small);
	});

	describe("generating the world", () => {
		let engineMock;
		let worldGeneratorMock;
		let dagobahGeneratorMock;

		beforeEach(() => {
			engineMock = mockEngine();
			worldGeneratorMock = mockGenerator();
			dagobahGeneratorMock = mockGenerator();

			spyOn(Generation, "WorldGenerator").and.returnValue(worldGeneratorMock);
			spyOn(Generation, "DagobahGenerator").and.returnValue(dagobahGeneratorMock);
		});

		it("can generate the original world", () => {
			spyOn(worldGeneratorMock, "generate").and.returnValue(true);
			subject.generateWorld(mockEngine);

			expect(Generation.WorldGenerator).toHaveBeenCalledWith(subject.size, subject.planet, mockEngine);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(subject.seed);
		});

		it("places hotspot items after generation", () => {
			spyOn(worldGeneratorMock, "generate").and.returnValue(true);
			spyOn(worldGeneratorMock.world, "layDownHotspotItems");
			spyOn(dagobahGeneratorMock.world, "layDownHotspotItems");
			subject.generateWorld(mockEngine);

			expect(worldGeneratorMock.world.layDownHotspotItems).toHaveBeenCalled();
			expect(dagobahGeneratorMock.world.layDownHotspotItems).toHaveBeenCalled();
		});

		it("keeps generating worlds with varying seed until it succeeds", () => {
			srand(0);

			spyOn(worldGeneratorMock, "generate").and.callFake(seed => {
				if (seed === 1) throw new WorldGenerationError();
				if (seed === 38) return false;
				return true;
			});

			subject.generateWorld(mockEngine);

			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(1);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(38);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(7719);
		});

		function mockEngine() {
			return {};
		}

		function mockGenerator() {
			return {
				world: mockWorld(),
				dagobah: mockWorld(),
				generate() {}
			};
		}

		function mockWorld() {
			return { layDownHotspotItems() {} };
		}
	});
});
