import { Instruction } from "/engine/objects";
import * as RemoveTile from "/engine/script/instructions/remove-tile";

describeInstruction("RemoveTile", (execute, engine) => {
	it("removes a tile from the current zone", () => {
		engine.currentZone.removeTile = () => {
		};
		spyOn(engine.currentZone, "removeTile");

		let instruction = new Instruction({});
		instruction._opcode = RemoveTile.Opcode;
		instruction._arguments = [1, 2, 3];
		execute(instruction);

		expect(engine.currentZone.removeTile).toHaveBeenCalledWith(1, 2, 3);
	});
});
