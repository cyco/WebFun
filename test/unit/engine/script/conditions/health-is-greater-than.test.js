import { Condition } from "src/engine/objects";
import HealthIsGreaterThan from "src/engine/script/conditions/health-is-greater-than";

describeCondition("HealthIsGreaterThan", (check, engine) => {
	it("checks if the hero's health is greater than the supplied value", async done => {
		const condition = new Condition();
		condition._opcode = HealthIsGreaterThan.Opcode;
		condition._arguments = [10];

		engine.hero.health = 5;
		expect(await check(condition)).toBeFalse();

		engine.hero.health = 11;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
