import { Condition } from "/engine/objects";
import * as PaddingIs from "./padding-is";

describeCondition('PaddingIs', (check, engine) => {
	it('checks if the current zone\'s padding value is equal to the given value', () => {
		const condition = new Condition();
		condition._opcode = PaddingIs.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(check(condition)).toBeTrue();

		engine.currentZone.padding = 10;
		expect(check(condition)).toBeFalse();
	});
});
