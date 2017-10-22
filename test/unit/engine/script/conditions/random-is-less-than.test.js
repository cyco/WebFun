import { Condition } from "src/engine/objects";
import * as RandomIsLessThan from "src/engine/script/conditions/random-is-less-than";

describeCondition("RandomIsLessThan", (check, engine) => {
	it("checks if the current zone's random value is less than the argument", async (done) => {
		const condition = new Condition();
		condition._opcode = RandomIsLessThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 4;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
