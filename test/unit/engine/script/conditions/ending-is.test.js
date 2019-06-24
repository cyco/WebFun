import { Condition } from "src/engine/objects";
import EndingIs from "src/engine/script/conditions/ending-is";

describeCondition("EndingIs", (check, engine) => {
	it("evaluates to true if the story's ending drops the item specified in `arg_0`", async () => {
		try {
			const condition = new Condition();
			condition._opcode = EndingIs.Opcode;
			condition._arguments = [0x12];

			engine.story = { goal: { item1: { id: 0x12 } } };
			expect(await check(condition)).toBeTrue();

			engine.story = { goal: { item1: { id: 0x15 } } };
			expect(await check(condition)).toBeFalse();
		} catch (e) {
			console.log("e", e);
			expect(false).toBeTrue();
		}
	});
});
