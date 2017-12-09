import { Instruction } from "src/engine/objects";
import EnableAllNPCs from "src/engine/script/instructions/enable-all-npcs";

describeInstruction("EnableAllNPCs", (execute, engine) => {
	it("enables all npcs in the current zone", async (done) => {
		engine.currentZone.npcs = [{}, {}, {}];

		let instruction = new Instruction({});
		instruction._opcode = EnableAllNPCs.Opcode;
		instruction._arguments = [];

		await execute(instruction);
		expect(engine.currentZone.npcs[0].enabled).toBeFalse();
		expect(engine.currentZone.npcs[1].enabled).toBeFalse();
		expect(engine.currentZone.npcs[2].enabled).toBeFalse();

		done();
	});
});
