import { Instruction } from "src/engine/objects";
import * as EnableHotspot from "src/engine/script/instructions/enable-hotspot";

describeInstruction("EnableHotspot", (execute, engine) => {
	it("enables the specified hotspot in the current zone", () => {
		engine.currentZone.hotspots = [null, null, {}, null];

		let instruction = new Instruction();
		instruction._opcode = EnableHotspot.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeTrue();
	});
});

