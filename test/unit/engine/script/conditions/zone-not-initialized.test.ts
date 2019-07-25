import { Condition } from "src/engine/objects";
import ZoneNotInitialized from "src/engine/script/conditions/zone-not-initialized";

describeCondition("ZoneNotInitialized", (check, engine) => {
	it("checks if the zone has been initialized yet", async () => {
		const condition = new Condition({ opcode: ZoneNotInitialized.Opcode });

		engine.currentZone.actionsInitialized = false;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.actionsInitialized = true;
		expect(await check(condition)).toBeFalse();
	});
});
