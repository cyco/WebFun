import { Instruction } from "/engine/objects";
import * as DisableHotspot from "./disable-hotspot";

describeInstruction('DisableHotspot', (execute, engine) => {
	it('disables the specified hotspot in the current zone', () => {
		engine.currentZone.hotspots = [null, null, {}, null];

		let instruction = new Instruction({});
		instruction._opcode = DisableHotspot.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeFalse();
	});
});

