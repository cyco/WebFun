import Wait from "src/engine/script/instructions/wait";

describeInstruction("Wait", (execute, engine) => {
	it("waits a few milliseconds before executing the next instruction", async () => {
		const instruction: any = {};
		instruction.opcode = Wait.Opcode;
		instruction.arguments = [];

		await execute(instruction);
	});
});
