import { Condition } from "/engine/objects";
import * as CounterIs from "./counter-is";

describeCondition("CounterIs", (check, engine) => {
	it("test is the current zone's counter is set to a specific value", () => {
		const condition = new Condition();
		condition._opcode = CounterIs.Opcode;
		condition._arguments = [5];

		engine.currentZone.counter = 5;
		expect(check(condition)).toBeTrue();

		engine.currentZone.counter = 10;
		expect(check(condition)).toBeFalse();
	});
});
