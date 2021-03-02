import { EvaluationMode } from "src/engine/script";
import ZoneEntered from "src/engine/script/conditions/zone-entered";

describeCondition("ZoneEntered", check => {
	it("checks if the zone has just been entered", async () => {
		const condition: any = { opcode: ZoneEntered.Opcode };

		expect(await check(condition, EvaluationMode.JustEntered | EvaluationMode.ByPlane)).toBeTrue();
		expect(await check(condition, EvaluationMode.Initialize)).toBeFalse();
	});
});
