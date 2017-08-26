import { Instruction } from "/engine/objects";
import * as PlaySound from "./play-sound";

describeInstruction("PlaySound", (execute, engine) => {
	it("play a sound", () => {
		let instruction = new Instruction({});
		instruction._opcode = PlaySound.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
