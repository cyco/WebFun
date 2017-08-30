import { Instruction } from "/engine/objects";
import * as Wait from "/engine/script/instructions/stop-sound";

describeInstruction("Wait", (execute, engine) => {
	it("wait a few milliseconds before executing the next instruction", () => {
		let instruction = new Instruction({});
		instruction._opcode = Wait.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
