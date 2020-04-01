import Redraw from "src/engine/script/instructions/redraw";

describeInstruction("Redraw", (execute, engine) => {
	it("redraws the current scene immediately without waiting for the next gameloop", async () => {
		const instruction: any = {};
		instruction.opcode = Redraw.Opcode;
		instruction.arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
