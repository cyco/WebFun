import SetRectNeedsDisplay from "src/engine/script/instructions/set-rect-needs-display";

describeInstruction("SetRectNeedsDisplay", (execute, engine) => {
	it("Marks the specified rect as dirty", async () => {
		const instruction: any = {};
		instruction.opcode = SetRectNeedsDisplay.Opcode;
		instruction.arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
