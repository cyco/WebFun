import NoItemPlaced from "src/engine/script/conditions/no-item-placed";

describeCondition("NoItemPlaced", (check, engine) => {
	it("returns true iff the user placed an item", async () => {
		engine.inputManager.placedTile = { id: 5 } as any;

		const condition: any = { opcode: NoItemPlaced.Opcode, arguments: [] };
		expect(await check(condition)).toBeFalse();
		engine.inputManager.placedTile = null;
		expect(await check(condition)).toBeTrue();
	});
});
