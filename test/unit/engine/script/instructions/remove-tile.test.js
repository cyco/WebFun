import { Instruction } from "src/engine/objects";
import RemoveTile from "src/engine/script/instructions/remove-tile";

describeInstruction("RemoveTile", (execute, engine) => {
	it("removes a tile from the current zone", async () => {
		engine.currentZone.removeTile = () => {};
		spyOn(engine.currentZone, "removeTile");

		const instruction = new Instruction({});
		instruction._opcode = RemoveTile.Opcode;
		instruction._arguments = [1, 2, 3];

		await execute(instruction);

		expect(engine.currentZone.removeTile).toHaveBeenCalledWith(1, 2, 3);
	});
});
