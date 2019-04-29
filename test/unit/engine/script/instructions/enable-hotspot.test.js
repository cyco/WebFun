import { Instruction } from "src/engine/objects";
import EnableHotspot from "src/engine/script/instructions/enable-hotspot";

describeInstruction("EnableHotspot", (execute, engine) => {
	it("enables the specified hotspot in the current zone", async done => {
		engine.currentZone.hotspots = [null, null, {}, null];

		const instruction = new Instruction();
		instruction._opcode = EnableHotspot.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeTrue();

		done();
	});
});
