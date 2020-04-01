import { Sound } from "src/engine/objects";
import PlaySound from "src/engine/script/instructions/play-sound";
import { Channel } from "src/engine/audio";
import { NullIfMissing } from "src/engine/asset-manager";

describeInstruction("PlaySound", (execute, engine) => {
	it("play a sound", () => {
		const mockSound = {};
		spyOn(engine.mixer, "play");
		spyOn(engine.assets, "get").and.returnValue(mockSound);

		const instruction: any = {};
		instruction.opcode = PlaySound.Opcode;
		instruction.arguments = [5];

		execute(instruction);
		expect(engine.assets.get).toHaveBeenCalledWith(Sound, 5, NullIfMissing);
		expect(engine.mixer.play).toHaveBeenCalledWith(mockSound, Channel.Effect);
	});
});
