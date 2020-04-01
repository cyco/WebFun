import SetTileNeedsDisplay from "src/engine/script/instructions/set-tile-needs-display";

describeInstruction("SetTileNeedsDisplay", (execute, engine) => {
	it("Marks the specified tile as dirty", async () => {
		const instruction: any = {};
		instruction.opcode = SetTileNeedsDisplay.Opcode;
		instruction.arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
