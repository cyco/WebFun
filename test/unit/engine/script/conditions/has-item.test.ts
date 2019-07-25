import { Condition } from "src/engine/objects";
import HasItem from "src/engine/script/conditions/has-item";

describeCondition("HasItem", (check, engine) => {
	it("checks if the inventory contains the specified item", async () => {
		engine.inventory = {
			contains: function(itemID: number) {
				return itemID === 13;
			}
		} as any;
		let condition = new Condition({ opcode: HasItem.Opcode, arguments: [13] });
		expect(await check(condition)).toBeTrue();

		condition = new Condition({ opcode: HasItem.Opcode, arguments: [15] });
		expect(await check(condition)).toBeFalse();
	});
});
