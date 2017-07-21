import { Condition } from "/engine/objects";
import * as RandomIsLessThan from "./random-is-less-than";

describeCondition('RandomIsLessThan', (check, engine) => {
	it('checks if the current zone\'s random value is less than the argument', () => {
		const condition = new Condition();
		condition._opcode = RandomIsLessThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.random = 5;
		expect(check(condition)).toBeFalse();

		engine.currentZone.random = 4;
		expect(check(condition)).toBeTrue();
	});
});
