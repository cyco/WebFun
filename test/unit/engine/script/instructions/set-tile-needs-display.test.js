import { Instruction } from "src/engine/objects";
import SetTileNeedsDisplay from "src/engine/script/instructions/set-tile-needs-display";

describeInstruction("SetTileNeedsDisplay", (execute, engine) => {
	it("Marks the specified tile as dirty", async () => {
		const instruction = new Instruction({});
		instruction._opcode = SetTileNeedsDisplay.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
