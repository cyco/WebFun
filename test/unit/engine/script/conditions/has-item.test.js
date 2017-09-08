import { Condition } from "src/engine/objects";
import * as HasItem from "src/engine/script/conditions/has-item";

describeCondition("HasItem", (check, engine) => {
	it("checks if the inventory contains the specified item", () => {
		engine.inventory = {
			contains: function (itemID) {
				return itemID === 13;
			}
		};
		const condition = new Condition();
		condition._opcode = HasItem.Opcode;
		condition._arguments = [13];
		expect(check(condition)).toBeTrue();

		condition._arguments = [15];
		expect(check(condition)).toBeFalse();
	});
});
