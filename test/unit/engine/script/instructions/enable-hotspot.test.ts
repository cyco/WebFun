import EnableHotspot from "src/engine/script/instructions/enable-hotspot";

describeInstruction("EnableHotspot", (execute, engine) => {
	it("enables the specified hotspot in the current zone", async () => {
		engine.currentZone.hotspots = [null, null, {}, null];

		const instruction: any = {};
		instruction.opcode = EnableHotspot.Opcode;
		instruction.arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.hotspots[2].enabled).toBeTrue();
	});
});
