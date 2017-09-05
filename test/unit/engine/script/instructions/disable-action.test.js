import { Instruction } from "src/engine/objects";
import { InstructionExecutor } from "src/engine/script";
import * as DisableAction from "src/engine/script/instructions/disable-action";

describeInstruction("DisableAction", () => {
	it("disables the action that's currently executing", () => {
		let engine = {
			currentZone: {},
			hero: {},
			state: {},
			data: {}
		};
		let executor = new InstructionExecutor(engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = {};
			engine.state = {};
			engine.data = {};
		});


		let instruction = new Instruction({});
		instruction._opcode = DisableAction.Opcode;
		instruction._arguments = [];

		const action = {};
		executor.action = action;

		executor.execute(instruction);
		expect(action.enabled).toBeFalse();
	});
});
