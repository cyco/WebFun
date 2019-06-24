import { Instruction } from "src/engine/objects";
import DrawTile from "src/engine/script/instructions/draw-tile";

describeInstruction("DrawTile", (execute, engine) => {
	it("draws a tile immediately without waiting for the next gameloop", async () => {
		const instruction = new Instruction({});
		instruction._opcode = DrawTile.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
