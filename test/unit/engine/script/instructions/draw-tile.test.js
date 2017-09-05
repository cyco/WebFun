import { Instruction } from "src/engine/objects";
import * as DrawTile from "src/engine/script/instructions/draw-tile";

describeInstruction("DrawTile", (execute, engine) => {
	it("draws a tile immediately without waiting for the next gameloop", () => {
		let instruction = new Instruction({});
		instruction._opcode = DrawTile.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
