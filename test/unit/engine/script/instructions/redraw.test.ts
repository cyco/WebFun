import { Instruction } from "src/engine/objects";
import Redraw from "src/engine/script/instructions/redraw";

describeInstruction("Redraw", (execute, engine) => {
	it("redraws the current scene immediately without waiting for the next gameloop", async () => {
		const instruction: any = new Instruction({});
		instruction._opcode = Redraw.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});