import { Instruction } from "src/engine/objects";
import Wait from "src/engine/script/instructions/wait";

describeInstruction("Wait", (execute, engine) => {
	it("waits a few milliseconds before executing the next instruction", async () => {
		const instruction: any = new Instruction({});
		instruction._opcode = Wait.Opcode;
		instruction._arguments = [];

		await execute(instruction);
	});
});
