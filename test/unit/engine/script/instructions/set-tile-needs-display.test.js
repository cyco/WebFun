import { Instruction } from "/engine/objects";
import * as SetTileNeedsDisplay from "/engine/script/instructions/set-tile-needs-display";

describeInstruction("SetTileNeedsDisplay", (execute, engine) => {
	it("Marks the specified tile as dirty", () => {
		let instruction = new Instruction({});
		instruction._opcode = SetTileNeedsDisplay.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
