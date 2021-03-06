import HeroIsAt from "src/engine/script/conditions/hero-is-at";

describeCondition("HeroIsAt", (check, engine) => {
	it("checks if the hero is currently at a specific location", async () => {
		const hero = engine.hero;
		const condition: any = { opcode: HeroIsAt.Opcode, arguments: [1, 2] };

		hero.location = { x: 1, y: 2 } as any;
		expect(await check(condition)).toBeTrue();

		hero.location = { x: 1, y: 1 } as any;
		expect(await check(condition)).toBeFalse();
	});
});
