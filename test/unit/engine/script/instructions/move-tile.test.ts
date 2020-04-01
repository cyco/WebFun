import MoveTile from "src/engine/script/instructions/move-tile";

describeInstruction("MoveTile", (execute, engine) => {
	it("moves the tile at the specified location to a new place on the same layer", async () => {
		spyOn(engine.currentZone, "setTile");
		spyOn(engine.currentZone, "getTile");

		const instruction: any = {};
		instruction.opcode = MoveTile.Opcode;
		instruction.arguments = [0, 1, 2, 3, 4];
		await execute(instruction);

		expect(engine.currentZone.getTile).toHaveBeenCalled();
		expect(engine.currentZone.setTile).toHaveBeenCalledTimes(2);
	});
});
