import { Condition } from "src/engine/objects";
import SharedCounterIsNot from "src/engine/script/conditions/shared-counter-is-not";

describeCondition("", (check, engine) => {
	it("checks if the current zone's sharedCounter value is not equal to the given value", async () => {
		const condition = new Condition({ opcode: SharedCounterIsNot.Opcode, arguments: [5] });

		engine.currentZone.sharedCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sharedCounter = 10;
		expect(await check(condition)).toBeTrue();
	});
});
