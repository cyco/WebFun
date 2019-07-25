import { Instruction } from "src/engine/objects";
import PlaySound from "src/engine/script/instructions/play-sound";

describeInstruction("PlaySound", (execute, engine) => {
	it("play a sound", () => {
		spyOn(engine.mixer.effectChannel, "playSound");

		const instruction: any = new Instruction({});
		instruction._opcode = PlaySound.Opcode;
		instruction._arguments = [5];

		execute(instruction);
		expect(engine.mixer.effectChannel.playSound).toHaveBeenCalledWith(5);
	});
});
