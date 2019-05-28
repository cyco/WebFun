import { Instruction } from "src/engine/objects";
import DropItem from "src/engine/script/instructions/drop-item";
import * as Util from "src/util";

describeInstruction("DropItem", (execute, engine) => {
	it("shows the pick-up scene with the specified item at the correct location", async done => {
		const mockedPoint = new Util.Point(1, 2);
		spyOn(engine, "dropItem");
		spyOn(Util, "Point").and.returnValue(mockedPoint);
		const mockTile = {};
		engine.data = { tiles: [null, null, null, mockTile] };

		const instruction = new Instruction({});
		instruction._opcode = DropItem.Opcode;
		instruction._arguments = [3, 1, 2];

		await execute(instruction);

		expect(engine.dropItem).toHaveBeenCalledWith(mockTile, mockedPoint);

		done();
	});

	it("drops the zones `findItem` if the first argument is `-1`", async done => {
		const mockedPoint = new Util.Point(1, 2);
		const mockTile = { id: 3 };
		spyOn(engine, "dropItem");
		spyOn(Util, "Point").and.returnValue(mockedPoint);
		spyOn(engine.currentWorld, "locationOfZone").and.returnValue(new Util.Point(5, 5));
		spyOn(engine.currentWorld, "at").and.returnValue({ findItem: mockTile, zone: engine.currentZone });
		engine.data = { tiles: [null, null, null, mockTile] };

		const instruction = new Instruction({});
		instruction._opcode = DropItem.Opcode;
		instruction._arguments = [-1, 1, 2];

		await execute(instruction);

		expect(engine.dropItem).toHaveBeenCalledWith(mockTile, mockedPoint);

		done();
	});
});
