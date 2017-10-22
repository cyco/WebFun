import { Condition } from "src/engine/objects";
import * as EnterByPlane from "src/engine/script/conditions/enter-by-plane";

describeCondition("EnterByPlane", (check, engine) => {
	it("checks if the zone has been entered by plane", async (done) => {
		const condition = new Condition();
		condition._opcode = EnterByPlane.Opcode;

		engine.state.enteredByPlane = true;
		expect(await check(condition)).toBeTrue();

		engine.state.enteredByPlane = false;
		expect(await check(condition)).toBeFalse();

		done();
	});
});
