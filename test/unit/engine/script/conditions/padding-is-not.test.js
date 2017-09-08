import { Condition } from "src/engine/objects";
import * as PaddingIsNot from "src/engine/script/conditions/padding-is-not";

describeCondition("", (check, engine) => {
	it("checks if the current zone's padding value is not equal to the given value", () => {
		const condition = new Condition();
		condition._opcode = PaddingIsNot.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.padding = 10;
		expect(check(condition)).toBeTrue();
	});
});
