import { Condition } from "src/engine/objects";
import StandingOn from "src/engine/script/conditions/standing-on";

describeCondition("StandingOn", (check, engine) => {
	it("checks if the hero is standing on a specific tile", async () => {
		const hero = engine.hero;
		const condition: any = { opcode: StandingOn.Opcode, arguments: [1, 2, 5] };

		hero.location = { x: 1, y: 2 } as any;
		engine.currentZone.getTileID = () => {
			return 5;
		};
		expect(await check(condition)).toBeTrue();

		hero.location.x = 2;
		expect(await check(condition)).toBeFalse();

		hero.location.x = 1;
		hero.location.y = 3;
		expect(await check(condition)).toBeFalse();

		hero.location = { x: 1, y: 2 } as any;
		engine.currentZone.getTileID = () => {
			return 3;
		};
		expect(await check(condition)).toBeFalse();
	});
});
