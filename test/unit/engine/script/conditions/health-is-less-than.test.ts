import HealthIsLessThan from "src/engine/script/conditions/health-is-less-than";

describeCondition("HealthIsLessThan", (check, engine) => {
	it("checks if the hero's health is less than the supplied value", async () => {
		const condition: any = { opcode: HealthIsLessThan.Opcode, arguments: [10] };

		engine.hero.health = 5;
		expect(await check(condition)).toBeTrue();

		engine.hero.health = 10;
		expect(await check(condition)).toBeFalse();
	});
});
