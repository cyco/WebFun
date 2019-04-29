import { Instruction } from "src/engine/objects";
import PlaceTile from "src/engine/script/instructions/place-tile";

describeInstruction("PlaceTile", (execute, engine) => {
	it("Places a tile at the specified coordinates", async done => {
		const tile = {};
		engine.data.tiles = [null, null, tile, null];
		engine.currentZone.setTile = () => {};
		spyOn(engine.currentZone, "setTile");

		const instruction = new Instruction({});
		instruction._opcode = PlaceTile.Opcode;
		instruction._arguments = [1, 2, 3, 2];
		await execute(instruction);

		expect(engine.currentZone.setTile).toHaveBeenCalledWith(tile, 1, 2, 3);

		done();
	});
});
