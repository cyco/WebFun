import { Condition } from "/engine/objects";
import * as HeroIsAt from "./hero-is-at";

describeCondition("HeroIsAt", (check, engine) => {
	it("checks if the hero is currently at a specific location", () => {
		const hero = engine.hero;
		const condition = new Condition();
		condition._opcode = HeroIsAt.Opcode;
		condition._arguments = [1, 2];

		hero.location = {x: 1, y: 2};
		expect(check(condition)).toBeTrue();

		hero.location = {x: 1, y: 1};
		expect(check(condition)).toBeFalse();
	});
});
