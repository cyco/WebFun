import { Instruction } from "src/engine/objects";
import * as DiableAllNPCs from "src/engine/script/instructions/disable-all-npcs";

describeInstruction("DiableAllNPCs", (execute, engine) => {
	it("enables all npcs in the current zone", () => {
		engine.currentZone.npcs = [{}, {}, {}];

		let instruction = new Instruction({});
		instruction._opcode = DiableAllNPCs.Opcode;
		instruction._arguments = [];

		execute(instruction);
		expect(engine.currentZone.npcs[0].enabled).toBeTrue();
		expect(engine.currentZone.npcs[1].enabled).toBeTrue();
		expect(engine.currentZone.npcs[2].enabled).toBeTrue();
	});
});

