import MarkAsSolved from "src/engine/script/instructions/mark-as-solved";
import Sector from "src/engine/sector";

describeInstruction("MarkAsSolved", (execute, engine) => {
	it("marks the current zone as solved", async () => {
		const sectorMock: Sector = { zone: {} } as any;
		engine.currentWorld.findSectorContainingZone = () => sectorMock;

		const instruction = { opcode: MarkAsSolved.Opcode };

		await execute(instruction);
		expect(sectorMock.solved1).toBeTrue();
		expect(sectorMock.solved2).toBeTrue();
		expect(sectorMock.solved3).toBeTrue();
		expect(sectorMock.solved4).toBeTrue();
	});
});
