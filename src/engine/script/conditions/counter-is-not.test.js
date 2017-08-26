import { Condition } from "/engine/objects";
import * as CounterIsNot from "./counter-is-not";

describeCondition("CounterIsNot", (check, engine) => {
	it("compares the supplied value against the current zone's counter, returning false on equality", () => {
		let condition = new Condition();
		condition._opcode = CounterIsNot.Opcode;
		condition._arguments = [5];

		engine.currentZone.counter = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.counter = 10;
		expect(check(condition)).toBeTrue();
	});
});
