import { Instruction } from "/engine/objects";
import * as EnableHotspot from "./enable-hotspot";

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

