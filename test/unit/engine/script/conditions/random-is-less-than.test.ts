import RandomIsLessThan from "src/engine/script/conditions/random-is-less-than";

describeCondition("RandomIsLessThan", (check, engine) => {
	it("checks if the current zone's random value is less than the argument", async () => {
		const condition: any = { opcode: RandomIsLessThan.Opcode, arguments: [5] };

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 4;
		expect(await check(condition)).toBeTrue();
	});
});
