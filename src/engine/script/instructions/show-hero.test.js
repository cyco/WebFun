import { Instruction } from "/engine/objects";
import * as ShowHero from "./show-hero";

describeInstruction("ShowHero", (execute, engine) => {
	it("hides the hero", () => {
		let instruction = new Instruction({});
		instruction._opcode = ShowHero.Opcode;
		instruction._arguments = [];

		engine.hero.visible = false;

		execute(instruction);
		expect(engine.hero.visible).toBeTrue();
	});
});
