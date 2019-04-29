import { Instruction } from "src/engine/objects";
import WinGame from "src/engine/script/instructions/win-game";

describeInstruction("WinGame", (execute, engine) => {
	it("ends the current story by winning", async done => {
		const instruction = new Instruction({});
		instruction._opcode = WinGame.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];

		try {
			await execute(instruction);
			expect(false).toBeTrue();
		} catch (e) {
			expect(e).toEqual("Game Won!");
		}

		done();
	});
});
