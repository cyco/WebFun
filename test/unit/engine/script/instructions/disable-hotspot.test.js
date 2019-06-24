import { Instruction } from "src/engine/objects";
import DisableHotspot from "src/engine/script/instructions/disable-hotspot";

describeInstruction("DisableHotspot", (execute, engine) => {
	it("disables the specified hotspot in the current zone", async () => {
		engine.currentZone.hotspots = [null, null, {}, null];

		const instruction = new Instruction({});
		instruction._opcode = DisableHotspot.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeFalse();
	});

	it("does nothing if the hotspot does not exist", async () => {
		engine.currentZone.hotspots = [];

		const instruction = new Instruction({});
		instruction._opcode = DisableHotspot.Opcode;
		instruction._arguments = [2];
		try {
			await execute(instruction);
		} catch (e) {
			expect(false).toBeTrue();
		}
	});
});
