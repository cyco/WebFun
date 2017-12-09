import { Condition } from "src/engine/objects";
import PaddingIsNot from "src/engine/script/conditions/padding-is-not";

describeCondition("", (check, engine) => {
	it("checks if the current zone's padding value is not equal to the given value", async (done) => {
		const condition = new Condition();
		condition._opcode = PaddingIsNot.Opcode;
		condition._arguments = [5];

		engine.currentZone.padding = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.padding = 10;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
