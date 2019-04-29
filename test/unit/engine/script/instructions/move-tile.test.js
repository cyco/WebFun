import { Instruction } from "src/engine/objects";
import MoveTile from "src/engine/script/instructions/move-tile";

describeInstruction("MoveTile", (execute, engine) => {
	it("moves the tile at the specified location to a new place on the same layer", async done => {
		engine.currentZone.moveTile = () => {};
		spyOn(engine.currentZone, "moveTile");

		const instruction = new Instruction({});
		instruction._opcode = MoveTile.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];
		await execute(instruction);

		expect(engine.currentZone.moveTile).toHaveBeenCalledWith(0, 1, 2, 3, 4);

		done();
	});
});
