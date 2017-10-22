import { Instruction } from "src/engine/objects";
import * as StopSound from "src/engine/script/instructions/stop-sound";

describeInstruction("StopSound", (execute, engine) => {
	it("stops all sounds that are currently playing", async (done) => {
		let instruction = new Instruction({});
		instruction._opcode = StopSound.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();

		done();
	});
});
