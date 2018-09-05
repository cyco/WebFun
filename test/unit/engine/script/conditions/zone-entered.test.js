import { Condition } from "src/engine/objects";
import ZoneEntered from "src/engine/script/conditions/zone-entered";

describeCondition("ZoneEntered", (check, engine) => {
	it("checks if the zone has just been entered", async done => {
		const condition = new Condition();
		condition._opcode = ZoneEntered.Opcode;

		engine.temporaryState.justEntered = true;
		expect(await check(condition)).toBeTrue();

		engine.temporaryState.justEntered = false;
		expect(await check(condition)).toBeFalse();

		done();
	});
});
