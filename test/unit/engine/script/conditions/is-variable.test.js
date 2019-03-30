import { Condition } from "src/engine/objects";
import IsVariable from "src/engine/script/conditions/is-variable";

describeCondition("IsVariable", (check, engine) => {
	it("checks if a specific tile is found at the given location", async done => {
		const condition = new Condition();
		condition._opcode = IsVariable.Opcode;
		condition._arguments = [10, 5, 7, 2];

		engine.currentZone.getTileID = function(x, y, z) {
			if (x === 5 && y === 7 && z === 2) return 10;
			return 7;
		};
		expect(await check(condition)).toBeTrue();

		condition._arguments = [3, 5, 7, 2];
		expect(await check(condition)).toBeFalse();

		done();
	});
});