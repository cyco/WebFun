import { Action } from "src/engine/objects";
import { InstructionExecutor } from "src/engine/script";
import DisableAction from "src/engine/script/instructions/disable-action";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Engine } from "src/engine";

describeInstruction("DisableAction", () => {
	it("disables the action that's currently executing", async () => {
		const engine: Engine = {
			currentZone: {},
			hero: {},
			temporaryState: {},
			data: {}
		} as any;

		const executor = new InstructionExecutor(InstructionImplementations, engine);
		const instruction: any = { opcode: DisableAction.Opcode };

		const action: Action = {} as any;
		executor.action = action;

		await executor.execute(instruction);
		expect(action.enabled).toBeFalse();
	});
});
