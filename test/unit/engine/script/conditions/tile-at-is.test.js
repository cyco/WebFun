import { Condition } from "src/engine/objects";
import TileAtIs from "src/engine/script/conditions/tile-at-is";

describeCondition("TileAtIs", (check, engine) => {
	it("checks if a specific tile is found at the given location", async (done) => {
		const condition = new Condition();
		condition._opcode = TileAtIs.Opcode;
		condition._arguments = [10, 5, 7, 2];

		engine.currentZone.getTileID = function (x, y, z) {
			if (x === 5 && y === 7 && z === 2) return 10;
			return 7;
		};
		expect(await check(condition)).toBeTrue();

		condition._arguments = [3, 5, 7, 2];
		expect(await check(condition)).toBeFalse();

		done();
	});
});
