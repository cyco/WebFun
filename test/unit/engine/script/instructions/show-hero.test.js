import { Instruction } from "src/engine/objects";
import ShowHero from "src/engine/script/instructions/show-hero";

describeInstruction("ShowHero", (execute, engine) => {
	it("hides the hero", async (done) => {
		let instruction = new Instruction({});
		instruction._opcode = ShowHero.Opcode;
		instruction._arguments = [];

		engine.hero.visible = false;

		await execute(instruction);
		expect(engine.hero.visible).toBeTrue();

		done();
	});
});
