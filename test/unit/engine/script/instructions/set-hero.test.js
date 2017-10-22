import { Instruction } from "src/engine/objects";
import * as SetHero from "src/engine/script/instructions/set-hero";

describeInstruction("SetHero", (execute, engine) => {
	it("moves the hero to the specified coordinates", async (done) => {
		engine.hero.location = {x: 2, y: 4};

		let instruction = new Instruction({});
		instruction._opcode = SetHero.Opcode;
		instruction._arguments = [12, 13];
		await execute(instruction);

		expect(engine.hero.location.x).toEqual(12);
		expect(engine.hero.location.y).toEqual(13);

		done();
	});
});
