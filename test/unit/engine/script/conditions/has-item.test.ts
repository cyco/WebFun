import { Condition } from "src/engine/objects";
import HasItem from "src/engine/script/conditions/has-item";

describeCondition("HasItem", (check, engine) => {
	it("checks if the inventory contains the item specified in argument 0", async () => {
		spyOn(engine.currentWorld, "findSectorContainingZone").and.returnValue({} as any);

		spyOn(engine.inventory, "contains").and.callFake(itemId => itemId === 13);
		let condition = new Condition({ opcode: HasItem.Opcode, arguments: [13] });
		expect(await check(condition)).toBeTrue();

		condition = new Condition({ opcode: HasItem.Opcode, arguments: [15] });
		expect(await check(condition)).toBeFalse();
	});

	it("checks for the current world's find item if the first argument is -1", async () => {
		spyOn(engine.currentWorld, "findSectorContainingZone").and.returnValue({
			findItem: { id: 5 }
		} as any);
		spyOn(engine.inventory, "contains").and.callFake(itemId => itemId === 5);

		const condition = new Condition({ opcode: HasItem.Opcode, arguments: [-1] });
		expect(await check(condition)).toBeTrue();
	});
});
