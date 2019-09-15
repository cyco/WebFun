import { Condition } from "src/engine/objects";
import ItemPlaced from "src/engine/script/conditions/item-placed";

describeCondition("ItemPlaced", (check, engine) => {
	it("returns true iff the user placd an item", async () => {
		engine.inputManager.placedTile = { id: 5 } as any;

		const condition = new Condition({ opcode: ItemPlaced.Opcode, arguments: [] });
		expect(await check(condition)).toBeTrue();
		engine.inputManager.placedTile = null;
		expect(await check(condition)).toBeFalse();
	});
});
