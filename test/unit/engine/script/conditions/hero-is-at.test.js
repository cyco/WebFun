import { Condition } from "src/engine/objects";
import HeroIsAt from "src/engine/script/conditions/hero-is-at";

describeCondition("HeroIsAt", (check, engine) => {
	it("checks if the hero is currently at a specific location", async done => {
		const hero = engine.hero;
		const condition = new Condition();
		condition._opcode = HeroIsAt.Opcode;
		condition._arguments = [1, 2];

		hero.location = { x: 1, y: 2 };
		expect(await check(condition)).toBeTrue();

		hero.location = { x: 1, y: 1 };
		expect(await check(condition)).toBeFalse();

		done();
	});
});
