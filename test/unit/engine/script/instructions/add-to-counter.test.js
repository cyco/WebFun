import { Instruction } from "src/engine/objects";
import AddToCounter from "src/engine/script/instructions/add-to-counter";

describeInstruction("AddToCounter", (execute, engine) => {
	it("adds a value to the current zone's counter", async (done) => {
		engine.currentZone.counter = 5;

		let instruction = new Instruction({});
		instruction._opcode = AddToCounter.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.counter).toBe(7);

		instruction._arguments = [-3];
		await execute(instruction);
		expect(engine.currentZone.counter).toBe(4);

		done();
	});
});
