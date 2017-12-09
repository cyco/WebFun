import { Instruction } from "src/engine/objects";
import SetPadding from "src/engine/script/instructions/set-padding";

describeInstruction("SetPadding", (execute, engine) => {
	it("set the current zone's padding to the specified value", async (done) => {
		let instruction = new Instruction({});
		instruction._opcode = SetPadding.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.padding).toBe(2);

		instruction._arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.padding).toBe(100);

		done();
	});
});
