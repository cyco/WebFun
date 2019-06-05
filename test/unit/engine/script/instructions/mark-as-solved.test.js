import { Instruction } from "src/engine/objects";
import MarkAsSolved from "src/engine/script/instructions/mark-as-solved";

describeInstruction("MarkAsSolved", (execute, engine) => {
	it("marks the current zone as solved", async done => {
		const worldItemMock = { zone: {} };
		engine.currentWorld.itemForZone = () => worldItemMock;

		const instruction = new Instruction({});
		instruction._opcode = MarkAsSolved.Opcode;
		instruction._arguments = [];
		await execute(instruction);
		expect(engine.currentZone.solved).toBeTrue();
		expect(worldItemMock.zone.solved).toBeTrue();

		done();
	});
});
