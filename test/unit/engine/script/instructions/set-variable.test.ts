import { Instruction, Tile } from "src/engine/objects";
import SetVariable from "src/engine/script/instructions/set-variable";

describeInstruction("SetVariable", (execute, engine) => {
	it("Places a tile at the specified coordinates", async () => {
		const tile = {};
		engine.assetManager.populate(Tile, [null, null, tile, null]);
		engine.currentZone.setTile = () => {};
		spyOn(engine.currentZone, "setTile");

		const instruction: any = new Instruction({}) as any;
		instruction._opcode = SetVariable.Opcode;
		instruction._arguments = [1, 2, 3, 2];
		await execute(instruction);

		expect(engine.currentZone.setTile).toHaveBeenCalledWith(tile, 1, 2, 3);
	});
});
