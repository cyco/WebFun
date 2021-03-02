import InstructionExecutor from "src/engine/script/instruction-executor";
import { InstructionImplementations as Instructions } from "src/engine/script/instructions";
import { Engine } from "src/engine";

describe("WebFun.Engine.Script.InstructionExecutor", () => {
	let executor: InstructionExecutor, engine: Engine;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {},
			data: {}
		} as any;

		executor = new InstructionExecutor(Instructions, engine);
	});

	it("has a function to execute a single instruction", () => {
		expect(typeof executor.execute).toBe("function");
	});
});
