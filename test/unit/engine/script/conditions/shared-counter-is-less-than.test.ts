import { Condition } from "src/engine/objects";
import SharedCounterIsLessThan from "src/engine/script/conditions/shared-counter-is-less-than";

describeCondition("SharedCounterIsLessThan", (check, engine) => {
	it("checks if the current zone's sharedCounter value is greater than the given value", async () => {
		const condition = new Condition({ opcode: SharedCounterIsLessThan.Opcode, arguments: [5] });

		engine.currentZone.sharedCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sharedCounter = 4;
		expect(await check(condition)).toBeTrue();
	});
});
