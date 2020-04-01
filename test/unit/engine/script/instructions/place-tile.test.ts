import { Tile } from "src/engine/objects";
import PlaceTile from "src/engine/script/instructions/place-tile";

describeInstruction("PlaceTile", (execute, engine) => {
	it("Places a tile at the specified coordinates", async () => {
		const tile = {};
		engine.assets.populate(Tile, [null, null, tile, null]);
		engine.currentZone.setTile = () => {};
		spyOn(engine.currentZone, "setTile");

		const instruction: any = {} as any;
		instruction.opcode = PlaceTile.Opcode;
		instruction.arguments = [1, 2, 3, 2];
		await execute(instruction);

		expect(engine.currentZone.setTile).toHaveBeenCalledWith(tile, 1, 2, 3);
	});
});
