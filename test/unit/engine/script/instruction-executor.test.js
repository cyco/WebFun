import { Opcode } from "src/engine/objects/instruction";
import InstructionExecutor from "src/engine/script/instruction-executor";

describe("InstructionExecutor", () => {
	let executor, engine;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {},
			state: {},
			data: {}
		};

		executor = new InstructionExecutor(engine);
	});

	it("has a function to execute a single instruction", () => {
		expect(typeof executor.execute).toBe("function");
	});
});
