import { Instruction } from "src/engine/objects";
import * as Wait from "src/engine/script/instructions/stop-sound";

describeInstruction("Wait", (execute, engine) => {
	it("wait a few milliseconds before executing the next instruction", () => {
		let instruction = new Instruction({});
		instruction._opcode = Wait.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
