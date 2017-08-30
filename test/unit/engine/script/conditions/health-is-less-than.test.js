import { Condition } from "/engine/objects";
import * as HealthIsLessThan from "/engine/script/conditions/health-is-less-than";

describeCondition("HealthIsLessThan", (check, engine) => {
	it("checks if the hero's health is less than the supplied value", () => {
		const condition = new Condition();
		condition._opcode = HealthIsLessThan.Opcode;
		condition._arguments = [10];

		engine.hero.health = 5;
		expect(check(condition)).toBeTrue();

		engine.hero.health = 10;
		expect(check(condition)).toBeFalse();
	});
});
