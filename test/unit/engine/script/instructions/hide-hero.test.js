import { Instruction } from "src/engine/objects";
import * as HideHero from "src/engine/script/instructions/hide-hero";

describeInstruction("HideHero", (execute, engine) => {
	it("hides the hero", () => {
		let instruction = new Instruction({});
		instruction._opcode = HideHero.Opcode;
		instruction._arguments = [];

		execute(instruction);
		expect(engine.hero.visible).toBeFalse();
	});
});
