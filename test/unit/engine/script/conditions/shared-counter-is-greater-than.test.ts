import SharedCounterIsGreaterThan from "src/engine/script/conditions/shared-counter-is-greater-than";

describeCondition("SharedCounterIsGreaterThan", (check, engine) => {
	it("checks if the current zone's sharedCounter value is greater than the given value", async () => {
		const condition: any = { opcode: SharedCounterIsGreaterThan.Opcode, arguments: [5] };

		engine.currentZone.sharedCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sharedCounter = 10;
		expect(await check(condition)).toBeTrue();
	});
});
