import { Condition } from "src/engine/objects";
import ZoneNotInitialized from "src/engine/script/conditions/zone-not-initialized";

describeCondition("ZoneNotInitialized", (check, engine) => {
	it("checks if the zone has been initialized yet", async (done) => {
		const condition = new Condition();
		condition._opcode = ZoneNotInitialized.Opcode;

		engine.currentZone.actionsInitialized = false;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.actionsInitialized = true;
		expect(await check(condition)).toBeFalse();

		done();
	});
});
