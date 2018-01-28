import { Instruction } from "src/engine/objects";
import PlaySound from "src/engine/script/instructions/play-sound";

describeInstruction("PlaySound", (execute, engine) => {
	it("play a sound", async done => {
		let instruction = new Instruction({});
		instruction._opcode = PlaySound.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();

		done();
	});
});
