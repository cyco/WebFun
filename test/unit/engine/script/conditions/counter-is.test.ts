import CounterIs from "src/engine/script/conditions/counter-is";

describeCondition("CounterIs", (check, engine) => {
	it("test is the current zone's counter is set to a specific value", async () => {
		const condition: any = { opcode: CounterIs.Opcode, arguments: [5] };

		engine.currentZone.counter = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.counter = 10;
		expect(await check(condition)).toBeFalse();
	});
});
