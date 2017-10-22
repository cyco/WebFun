import { Instruction } from "src/engine/objects";
import * as HideHero from "src/engine/script/instructions/hide-hero";

describeInstruction("HideHero", (execute, engine) => {
	it("hides the hero", async (done) => {
		let instruction = new Instruction({});
		instruction._opcode = HideHero.Opcode;
		instruction._arguments = [];

		await execute(instruction);
		expect(engine.hero.visible).toBeFalse();

		done();
	});
});
