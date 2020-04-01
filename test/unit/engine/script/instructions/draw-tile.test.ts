import DrawTile from "src/engine/script/instructions/draw-tile";

describeInstruction("DrawTile", (execute, engine) => {
	it("draws a tile immediately without waiting for the next gameloop", async () => {
		const instruction: any = {};
		instruction.opcode = DrawTile.Opcode;
		instruction.arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
