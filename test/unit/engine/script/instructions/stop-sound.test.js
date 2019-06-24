import { Instruction } from "src/engine/objects";
import StopSound from "src/engine/script/instructions/stop-sound";

describeInstruction("StopSound", (execute, engine) => {
	it("stops all sounds that are currently playing", async () => {
		const instruction = new Instruction({});
		instruction._opcode = StopSound.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
