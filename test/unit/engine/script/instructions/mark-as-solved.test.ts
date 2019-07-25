import { Instruction } from "src/engine/objects";
import MarkAsSolved from "src/engine/script/instructions/mark-as-solved";
import { WorldItem } from "src/engine/generation";

describeInstruction("MarkAsSolved", (execute, engine) => {
	it("marks the current zone as solved", async () => {
		const worldItemMock: WorldItem = { zone: {} } as any;
		engine.currentWorld.itemForZone = () => worldItemMock;

		const instruction = new Instruction({ opcode: MarkAsSolved.Opcode });

		await execute(instruction);
		expect(engine.currentZone.solved).toBeTrue();
		expect(worldItemMock.zone.solved).toBeTrue();
	});
});
