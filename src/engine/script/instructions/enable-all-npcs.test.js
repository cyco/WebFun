import { Instruction } from "/engine/objects";
import * as EnableAllNPCs from "./enable-all-npcs";

describeInstruction("EnableAllNPCs", (execute, engine) => {
	it("enables all npcs in the current zone", () => {
		engine.currentZone.npcs = [{}, {}, {}];

		let instruction = new Instruction({});
		instruction._opcode = EnableAllNPCs.Opcode;
		instruction._arguments = [];

		execute(instruction);
		expect(engine.currentZone.npcs[0].enabled).toBeFalse();
		expect(engine.currentZone.npcs[1].enabled).toBeFalse();
		expect(engine.currentZone.npcs[2].enabled).toBeFalse();
	});
});

