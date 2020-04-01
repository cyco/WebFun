import SharedCounterIs from "src/engine/script/conditions/shared-counter-is";

describeCondition("SharedCounterIs", (check, engine) => {
	it("checks if the current zone's sharedCounter value is equal to the given value", async () => {
		const condition: any = { opcode: SharedCounterIs.Opcode, arguments: [5] };

		engine.currentZone.sharedCounter = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.sharedCounter = 10;
		expect(await check(condition)).toBeFalse();
	});
});
