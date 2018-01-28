import { Instruction } from "src/engine/objects";
import AddHealth from "src/engine/script/instructions/add-health";

describeInstruction("AddHealth", (execute, engine) => {
	it("replenishes the hero's health", async done => {
		engine.hero.health = 4;

		let instruction = new Instruction();
		instruction._opcode = AddHealth.Opcode;
		instruction._arguments = [15];

		await execute(instruction);
		expect(engine.hero.health).toBe(19);

		done();
	});
});
