import InstructionExecutor from "src/engine/script/instruction-executor";
import Instructions from "src/engine/script/instructions";

describe("InstructionExecutor", () => {
	let executor, engine;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {},
			temporaryState: {},
			data: {}
		};

		executor = new InstructionExecutor(Instructions, engine);
	});

	it("has a function to execute a single instruction", () => {
		expect(typeof executor.execute).toBe("function");
	});
});
