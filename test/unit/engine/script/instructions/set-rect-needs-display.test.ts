import { Instruction } from "src/engine/objects";
import SetRectNeedsDisplay from "src/engine/script/instructions/set-rect-needs-display";

describeInstruction("SetRectNeedsDisplay", (execute, engine) => {
	it("Marks the specified rect as dirty", async () => {
		const instruction: any = new Instruction({});
		instruction._opcode = SetRectNeedsDisplay.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});