import { Condition } from "/engine/objects";
import * as ZoneNotInitialized from "/engine/script/conditions/zone-not-initialized";

describeCondition("ZoneNotInitialized", (check, engine) => {
	it("checks if the zone has been initialized yet", () => {
		const condition = new Condition();
		condition._opcode = ZoneNotInitialized.Opcode;

		engine.currentZone.actionsInitialized = false;
		expect(check(condition)).toBeTrue();

		engine.currentZone.actionsInitialized = true;
		expect(check(condition)).toBeFalse();
	});
});
