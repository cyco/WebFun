import { Instruction } from "src/engine/objects";
import EnableAllMonsters from "src/engine/script/instructions/enable-all-monsters";

describeInstruction("EnableAllMonsters", (execute, engine) => {
	it("enables all monsters in the current zone", async () => {
		engine.currentZone.monsters = [{}, {}, {}];

		const instruction = new Instruction({ opcode: EnableAllMonsters.Opcode });

		await execute(instruction);
		expect(engine.currentZone.monsters[0].enabled).toBeFalse();
		expect(engine.currentZone.monsters[1].enabled).toBeFalse();
		expect(engine.currentZone.monsters[2].enabled).toBeFalse();
	});
});
