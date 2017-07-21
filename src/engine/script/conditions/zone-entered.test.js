import { Condition } from "/engine/objects";
import * as ZoneEntered from "./zone-entered";

describeCondition('ZoneEntered', (check, engine) => {
	it('checks if the zone has just been entered', () => {
		const condition = new Condition();
		condition._opcode = ZoneEntered.Opcode;

		engine.state.justEntered = true;
		expect(check(condition)).toBeTrue();

		engine.state.justEntered = false;
		expect(check(condition)).toBeFalse();
	});
});
