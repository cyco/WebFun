import { Condition } from "src/engine/objects";
import RandomIsNot from "src/engine/script/conditions/random-is-not";

describeCondition("RandomIsNot", (check, engine) => {
	it("tests is the current zone's random value is not equal to the supplied value", async (done) => {
		const condition = new Condition();
		condition._opcode = RandomIsNot.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 10;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
