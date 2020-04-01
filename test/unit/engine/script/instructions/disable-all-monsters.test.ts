import DiableAllMonsters from "src/engine/script/instructions/disable-all-monsters";
import { Point } from "src/util";

describeInstruction("DiableAllMonsters", (execute, engine) => {
	it("enables all monsters in the current zone", async () => {
		engine.currentZone.monsters = [
			{ position: new Point(0, 0) },
			{ position: new Point(0, 0) },
			{ position: new Point(0, 0) }
		];

		const instruction: any = {};
		instruction.opcode = DiableAllMonsters.Opcode;
		instruction.arguments = [];

		await execute(instruction);
		expect(engine.currentZone.monsters[0].enabled).toBeFalse();
		expect(engine.currentZone.monsters[1].enabled).toBeFalse();
		expect(engine.currentZone.monsters[2].enabled).toBeFalse();
	});
});
