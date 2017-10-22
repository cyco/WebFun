import { Instruction } from "src/engine/objects";
import * as DisableHotspot from "src/engine/script/instructions/disable-hotspot";

describeInstruction("DisableHotspot", (execute, engine) => {
	it("disables the specified hotspot in the current zone", async (done) => {
		engine.currentZone.hotspots = [null, null, {}, null];

		let instruction = new Instruction({});
		instruction._opcode = DisableHotspot.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeFalse();

		done();
	});
});

