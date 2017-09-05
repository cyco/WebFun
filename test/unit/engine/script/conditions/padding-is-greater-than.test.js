import { Condition } from "src/engine/objects";
import * as PaddingIsGreaterThan from "src/engine/script/conditions/padding-is-greater-than";

describeCondition("PaddingIsGreaterThan", (check, engine) => {
	it("checks if the current zone's padding value is greater than the given value", () => {
		const condition = new Condition();
		condition._opcode = PaddingIsGreaterThan.Opcode;
		condition._arguments = [ 5 ];

		engine.currentZone.padding = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.padding = 10;
		expect(check(condition)).toBeTrue();
	});
});
