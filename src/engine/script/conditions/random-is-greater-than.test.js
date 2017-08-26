import { Condition } from "/engine/objects";
import * as RandomIsGreaterThan from "./random-is-greater-than";

describeCondition("RandomIsGreaterThan", (check, engine) => {
	it("checks if the current zone's random value is greater than the argument", () => {
		const condition = new Condition();
		condition._opcode = RandomIsGreaterThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.random = 10;
		expect(check(condition)).toBeTrue();
	});
});
