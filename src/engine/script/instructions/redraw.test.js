import { Instruction } from "/engine/objects";
import * as Redraw from "./redraw";

describeInstruction("Redraw", (execute, engine) => {
	it("redraws the current scene immediately without waiting for the next gameloop", () => {
		let instruction = new Instruction({});
		instruction._opcode = Redraw.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
