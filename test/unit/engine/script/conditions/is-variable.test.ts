import { Condition } from "src/engine/objects";
import IsVariable from "src/engine/script/conditions/is-variable";

describeCondition("IsVariable", (check, engine) => {
	it("checks if a specific tile is found at the given location", async () => {
		let condition = new Condition({ opcode: IsVariable.Opcode, arguments: [10, 5, 7, 2] });

		engine.currentZone.getTileID = function(x, y, z) {
			if (x === 5 && y === 7 && z === 2) return 10;
			return 7;
		};
		expect(await check(condition)).toBeTrue();

		condition = new Condition({ opcode: IsVariable.Opcode, arguments: [3, 5, 7, 2] });
		expect(await check(condition)).toBeFalse();
	});
});
