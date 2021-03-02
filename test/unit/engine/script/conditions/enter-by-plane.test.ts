import { EvaluationMode } from "src/engine/script";
import EnterByPlane from "src/engine/script/conditions/enter-by-plane";

describeCondition("EnterByPlane", check => {
	it("checks if the zone has been entered by plane", async () => {
		const condition: any = { opcode: EnterByPlane.Opcode };

		expect(await check(condition, EvaluationMode.ByPlane | EvaluationMode.JustEntered)).toBeTrue();
		expect(await check(condition, EvaluationMode.Initialize)).toBeFalse();
	});
});
