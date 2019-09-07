import { Instruction } from "src/engine/objects";
import DropItem from "src/engine/script/instructions/drop-item";
import * as Util from "src/util";
import { Tile } from "src/engine/objects";

describeInstruction("DropItem", (execute, engine) => {
	it("shows the pick-up scene with the specified item at the correct location", async () => {
		const mockedPoint = new Util.Point(1, 2);
		spyOn(engine, "dropItem");
		spyOn(Util, "Point").and.returnValue(mockedPoint);
		const mockTile = {};
		engine.assetManager.populate(Tile, [null, null, null, mockTile]);

		const instruction: any = new Instruction({}) as any;
		instruction._opcode = DropItem.Opcode;
		instruction._arguments = [3, 1, 2];

		await execute(instruction);

		expect(engine.dropItem).toHaveBeenCalledWith(mockTile, mockedPoint);
	});

	it("drops the zones `findItem` if the first argument is `-1`", async () => {
		const mockedPoint = new Util.Point(1, 2);
		const mockTile = { id: 3 };
		spyOn(engine, "dropItem");
		spyOn(Util, "Point").and.returnValue(mockedPoint);
		spyOn(engine.currentWorld, "findSectorContainingZone").and.returnValue({
			findItem: mockTile,
			zone: engine.currentZone
		});
		engine.assetManager.populate(Tile, [null, null, null, mockTile]);

		const instruction: any = new Instruction({}) as any;
		instruction._opcode = DropItem.Opcode;
		instruction._arguments = [-1, 1, 2];

		await execute(instruction);

		expect(engine.dropItem).toHaveBeenCalledWith(mockTile, mockedPoint);
	});
});
