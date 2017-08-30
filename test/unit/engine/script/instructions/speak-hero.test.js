import { Instruction } from "/engine/objects";
import * as SpeakHero from "/engine/script/instructions/speak-hero";
import * as SpeakText from "/engine/script/instructions/speak-text";

xdescribeInstruction("SpeakHero", (execute, engine) => {
	it("shows a speech bubble next to the hero", () => {
		const location = {};
		engine.hero.location = location;
		spyOn(SpeakText, "default");

		let instruction = new Instruction({});
		instruction._opcode = SpeakHero.Opcode;
		instruction._additionalData = "test text";

		execute(instruction);

		expect(SpeakText.default).toHaveBeenCalledWith("test text", location, engine);

	});
});
