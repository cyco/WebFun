import { Condition } from "src/engine/objects";
import RandomIsGreaterThan from "src/engine/script/conditions/random-is-greater-than";

describeCondition("RandomIsGreaterThan", (check, engine) => {
	it("checks if the current zone's random value is greater than the argument", async (done) => {
		const condition = new Condition();
		condition._opcode = RandomIsGreaterThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 10;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
