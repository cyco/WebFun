import { Condition } from '/engine/objects';
import * as EnterByPlane from './enter-by-plane';

describeCondition('EnterByPlane', (check, engine) => {
	it('checks if the zone has been entered by plane', () => {
		const condition = new Condition();
		condition._opcode = EnterByPlane.Opcode;

		engine.state.enteredByPlane = true;
		expect(check(condition)).toBeTrue();

		engine.state.enteredByPlane = false;
		expect(check(condition)).toBeFalse();
	});
});
