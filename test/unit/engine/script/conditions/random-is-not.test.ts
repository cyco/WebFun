import RandomIsNot from "src/engine/script/conditions/random-is-not";

describeCondition("RandomIsNot", (check, engine) => {
	it("tests is the current zone's random value is not equal to the supplied value", async () => {
		const condition: any = { opcode: RandomIsNot.Opcode, arguments: [5] };

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.random = 10;
		expect(await check(condition)).toBeTrue();
	});
});
