import { Condition } from '/engine/objects';
import * as HealthIsGreaterThan from './health-is-greater-than';

describeCondition('HealthIsGreaterThan', (check, engine) => {
	it('checks if the hero\'s health is greater than the supplied value', () => {
		const condition = new Condition();
		condition._opcode = HealthIsGreaterThan.Opcode;
		condition._arguments = [10];

		engine.hero.health = 5;
		expect(check(condition)).toBeFalse();

		engine.hero.health = 11;
		expect(check(condition)).toBeTrue();
	});
});
