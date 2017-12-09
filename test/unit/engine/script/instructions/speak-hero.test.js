import { Instruction } from "src/engine/objects";
import SpeakHero from "src/engine/script/instructions/speak-hero";
import * as SpeakText from "src/engine/script/instructions/speak-text";

xdescribeInstruction("SpeakHero", (execute, engine) => {
	it("shows a speech bubble next to the hero", async (done) => {
		const location = {};
		engine.hero.location = location;
		spyOn(SpeakText, "default");

		let instruction = new Instruction({});
		instruction._opcode = SpeakHero.Opcode;
		instruction._additionalData = "test text";

		await execute(instruction);

		expect(SpeakText.default).toHaveBeenCalledWith("test text", location, engine);

		done();
	});
});
