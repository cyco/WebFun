import CounterIsNot from "src/engine/script/conditions/counter-is-not";

describeCondition("CounterIsNot", (check, engine) => {
	it("compares the supplied value against the current zone's counter, returning false on equality", async () => {
		const condition: any = { opcode: CounterIsNot.Opcode, arguments: [5] };

		engine.currentZone.counter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.counter = 10;
		expect(await check(condition)).toBeTrue();
	});
});
