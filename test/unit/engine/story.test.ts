import Story from "src/engine/story";
import { Planet, WorldSize } from "src/engine/types";
import { srand } from "src/util";
import * as Generation from "src/engine/generation";
import { WorldGenerationError } from "src/engine/generation";

describe("WebFun.Engine.Story", () => {
	let subject: Story;
	beforeEach(() => (subject = new Story(1, Planet.Hoth, WorldSize.Small)));
	it("is a simple container for seed, size and world size", () => {
		expect(subject.seed).toBe(1);
		expect(subject.planet).toBe(Planet.Hoth);
		expect(subject.size).toBe(WorldSize.Small);
	});

	describe("generating the world", () => {
		let engineMock: any;
		let worldGeneratorMock: any;
		let dagobahGeneratorMock: any;

		beforeEach(() => {
			engineMock = mockEngine();
			worldGeneratorMock = mockGenerator();
			dagobahGeneratorMock = mockGenerator();

			spyOn(Generation, "WorldGenerator").and.returnValue(worldGeneratorMock);
			spyOn(Generation, "DagobahGenerator").and.returnValue(dagobahGeneratorMock);
		});

		it("can generate the original world", () => {
			spyOn(worldGeneratorMock, "generate").and.returnValue(true);
			subject.generateWorld(engineMock);

			expect(Generation.WorldGenerator).toHaveBeenCalledWith(subject.size, subject.planet, engineMock);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(subject.seed, 0);
		});

		it("keeps generating worlds with varying seed until it succeeds", () => {
			srand(0);

			spyOn(worldGeneratorMock, "generate").and.callFake((seed: number) => {
				if (seed === 1) throw new WorldGenerationError();
				if (seed === 38) return false;
				return true;
			});

			subject.generateWorld(engineMock, 0, 50);

			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(1, 0);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(38, 0);
			expect(worldGeneratorMock.generate).toHaveBeenCalledWith(7719, 0);
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
			return {};
		}
	});
});
