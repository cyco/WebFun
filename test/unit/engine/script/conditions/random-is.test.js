import { Condition } from "src/engine/objects";
import * as RandomIs from "src/engine/script/conditions/random-is";

describeCondition("RandomIs", (check, engine) => {
	it("it checks if the supplied value is equal to the current zone's random value", () => {
		const condition = new Condition();
		condition._opcode = RandomIs.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(check(condition)).toBeTrue();

		engine.currentZone.random = 10;
		expect(check(condition)).toBeFalse();
	});
});
