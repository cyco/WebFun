import { Condition } from "src/engine/objects";
import SharedCounterIs from "src/engine/script/conditions/shared-counter-is";

describeCondition("SharedCounterIs", (check, engine) => {
	it("checks if the current zone's sharedCounter value is equal to the given value", async done => {
		const condition = new Condition();
		condition._opcode = SharedCounterIs.Opcode;
		condition._arguments = [5];

		engine.currentZone.sharedCounter = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.sharedCounter = 10;
		expect(await check(condition)).toBeFalse();

		done();
	});
});
