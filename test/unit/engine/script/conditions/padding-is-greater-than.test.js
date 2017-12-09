import { Condition } from "src/engine/objects";
import PaddingIsGreaterThan from "src/engine/script/conditions/padding-is-greater-than";

describeCondition("PaddingIsGreaterThan", (check, engine) => {
	it("checks if the current zone's padding value is greater than the given value", async (done) => {
		const condition = new Condition();
		condition._opcode = PaddingIsGreaterThan.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.padding = 10;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
