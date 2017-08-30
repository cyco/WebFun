import { Instruction } from "/engine/objects";
import * as SetPadding from "/engine/script/instructions/set-padding";

describeInstruction("SetPadding", (execute, engine) => {
	it("set the current zone's padding to the specified value", () => {
		let instruction = new Instruction({});
		instruction._opcode = SetPadding.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.padding).toBe(2);

		instruction._arguments = [100];
		execute(instruction);
		expect(engine.currentZone.padding).toBe(100);
	});
});
