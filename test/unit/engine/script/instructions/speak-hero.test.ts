import { Instruction } from "src/engine/objects";
import SpeakHero from "src/engine/script/instructions/speak-hero";

describeInstruction("SpeakHero", (execute, engine) => {
	it("shows a speech bubble next to the hero", async () => {
		const location = {};
		engine.hero.location = location;
		spyOn(engine, "speak");

		const instruction: any = new Instruction({});
		instruction._opcode = SpeakHero.Opcode;
		instruction._additionalData = "test text";

		await execute(instruction);

		expect(engine.speak).toHaveBeenCalledWith("test text", location);
	});
});
