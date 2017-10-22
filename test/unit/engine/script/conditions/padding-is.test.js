import { Condition } from "src/engine/objects";
import * as PaddingIs from "src/engine/script/conditions/padding-is";

describeCondition("PaddingIs", (check, engine) => {
	it("checks if the current zone's padding value is equal to the given value", async (done) => {
		const condition = new Condition();
		condition._opcode = PaddingIs.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.padding = 10;
		expect(await check(condition)).toBeFalse();

		done();
	});
});
