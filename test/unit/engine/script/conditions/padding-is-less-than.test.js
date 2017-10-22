import { Condition } from "src/engine/objects";
import * as PaddingIsLessThan from "src/engine/script/conditions/padding-is-less-than";

describeCondition("PaddingIsLessThan", (check, engine) => {
	it("checks if the current zone's padding value is greater than the given value", async (done) => {
		const condition = new Condition();
		condition._opcode = PaddingIsLessThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.padding = 4;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
