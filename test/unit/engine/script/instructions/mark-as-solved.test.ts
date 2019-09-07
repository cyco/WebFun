import { Instruction } from "src/engine/objects";
import MarkAsSolved from "src/engine/script/instructions/mark-as-solved";
import { Sector } from "src/engine/generation";

describeInstruction("MarkAsSolved", (execute, engine) => {
	it("marks the current zone as solved", async () => {
		const sectorMock: Sector = { zone: {} } as any;
		engine.currentWorld.itemForZone = () => sectorMock;

		const instruction = new Instruction({ opcode: MarkAsSolved.Opcode });

		await execute(instruction);
		expect(engine.currentZone.solved).toBeTrue();
		expect(sectorMock.zone.solved).toBeTrue();
	});
});
