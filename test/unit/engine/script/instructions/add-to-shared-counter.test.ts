import { Instruction } from "src/engine/objects";
import AddToSharedCounter from "src/engine/script/instructions/add-to-shared-counter";

describeInstruction("AddToSharedCounter", (execute, engine) => {
	it("adds a value to the current zone's sharedCounter", async () => {
		engine.currentZone.sharedCounter = 5;

		let instruction = new Instruction({ opcode: AddToSharedCounter.Opcode, arguments: [2] });

		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(7);

		instruction = new Instruction({ opcode: AddToSharedCounter.Opcode, arguments: [-3] });
		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(4);
	});
});
