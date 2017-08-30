import { Condition } from "/engine/objects";
import * as PaddingIsLessThan from "/engine/script/conditions/padding-is-less-than";

describeCondition("PaddingIsLessThan", (check, engine) => {
	it("checks if the current zone's padding value is greater than the given value", () => {
		const condition = new Condition();
		condition._opcode = PaddingIsLessThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.padding = 4;
		expect(check(condition)).toBeTrue();
	});
});
