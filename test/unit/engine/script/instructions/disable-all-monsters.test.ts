import { Instruction } from "src/engine/objects";
import DiableAllMonsters from "src/engine/script/instructions/disable-all-monsters";

describeInstruction("DiableAllMonsters", (execute, engine) => {
	it("enables all monsters in the current zone", async () => {
		engine.currentZone.monsters = [{}, {}, {}];

		const instruction: any = new Instruction({});
		instruction._opcode = DiableAllMonsters.Opcode;
		instruction._arguments = [];

		await execute(instruction);
		expect(engine.currentZone.monsters[0].enabled).toBeFalse();
		expect(engine.currentZone.monsters[1].enabled).toBeFalse();
		expect(engine.currentZone.monsters[2].enabled).toBeFalse();
	});
});
