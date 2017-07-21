import { Instruction } from "/engine/objects";
import * as PlaceTile from "./place-tile";

describeInstruction('PlaceTile', (execute, engine) => {
	it('Places a tile at the specified coordinates', () => {
		const tile = {};
		engine.data.tiles = [null, null, tile, null];
		engine.currentZone.setTile = () => {
		};
		spyOn(engine.currentZone, 'setTile');

		let instruction = new Instruction({});
		instruction._opcode = PlaceTile.Opcode;
		instruction._arguments = [1, 2, 3, 2];
		execute(instruction);

		expect(engine.currentZone.setTile).toHaveBeenCalledWith(tile, 1, 2, 3);
	});
});
