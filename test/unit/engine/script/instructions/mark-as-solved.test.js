import { Instruction } from "src/engine/objects";
import * as MarkAsSolved from "src/engine/script/instructions/mark-as-solved";

describeInstruction("MarkAsSolved", (execute, engine) => {
	it("marks the current zone as solved", () => {
		let instruction = new Instruction({});
		instruction._opcode = MarkAsSolved.Opcode;
		instruction._arguments = [];
		execute(instruction);
		expect(engine.currentZone.solved).toBeTrue();
	});
});
