import { Instruction } from "src/engine/objects";
import RemoveTile from "src/engine/script/instructions/remove-tile";

describeInstruction("RemoveTile", (execute, engine) => {
	it("removes a tile from the current zone", async () => {
		engine.currentZone.setTile = () => {};
		spyOn(engine.currentZone, "setTile");

		const instruction: any = new Instruction({});
		instruction._opcode = RemoveTile.Opcode;
		instruction._arguments = [1, 2, 3];

		await execute(instruction);

		expect(engine.currentZone.setTile).toHaveBeenCalledWith(null, 1, 2, 3);
	});
});
