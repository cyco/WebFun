import { Instruction } from "src/engine/objects";
import { InstructionExecutor } from "src/engine/script";
import DisableAction from "src/engine/script/instructions/disable-action";
import { InstructionImplementations } from "src/engine/script/instructions";

describeInstruction("DisableAction", () => {
	it("disables the action that's currently executing", async done => {
		const engine = {
			currentZone: {},
			hero: {},
			temporaryState: {},
			data: {}
		};

		const executor = new InstructionExecutor(InstructionImplementations, engine);
		const instruction = new Instruction({});
		instruction._opcode = DisableAction.Opcode;
		instruction._arguments = [];

		const action = {};
		executor.action = action;

		await executor.execute(instruction);
		expect(action.enabled).toBeFalse();

		done();
	});
});
