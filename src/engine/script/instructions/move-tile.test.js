import { Instruction } from "/engine/objects";
import * as MoveTile from "./move-tile";

describeInstruction('MoveTile', (execute, engine) => {
	it('moves the tile at the specified location to a new place on the same layer', () => {
		engine.currentZone.moveTile = () => {
		};
		spyOn(engine.currentZone, 'moveTile');

		let instruction = new Instruction({});
		instruction._opcode = MoveTile.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];
		execute(instruction);

		expect(engine.currentZone.moveTile).toHaveBeenCalledWith(0, 1, 2, 3, 4);
	});
});
