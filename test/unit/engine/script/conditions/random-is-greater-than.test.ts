import RandomIsGreaterThan from "src/engine/script/conditions/random-is-greater-than";

describeCondition("RandomIsGreaterThan", (check, engine) => {
	it("checks if the current zone's random value is greater than the argument", async () => {
		const condition: any = { opcode: RandomIsGreaterThan.Opcode, arguments: [5] };

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 10;
		expect(await check(condition)).toBeTrue();
	});
});
