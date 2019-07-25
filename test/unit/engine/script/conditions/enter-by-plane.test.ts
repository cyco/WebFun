import { Condition } from "src/engine/objects";
import EnterByPlane from "src/engine/script/conditions/enter-by-plane";

describeCondition("EnterByPlane", (check, engine) => {
	it("checks if the zone has been entered by plane", async () => {
		const condition = new Condition({ opcode: EnterByPlane.Opcode });

		engine.temporaryState.enteredByPlane = true;
		expect(await check(condition)).toBeTrue();

		engine.temporaryState.enteredByPlane = false;
		expect(await check(condition)).toBeFalse();
	});
});