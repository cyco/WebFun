import { Condition } from "src/engine/objects";
import RandomIs from "src/engine/script/conditions/random-is";

describeCondition("RandomIs", (check, engine) => {
	it("it checks if the supplied value is equal to the current zone's random value", async () => {
		const condition = new Condition({ opcode: RandomIs.Opcode, arguments: [5] });

		engine.currentZone.random = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.random = 10;
		expect(await check(condition)).toBeFalse();
	});
});
