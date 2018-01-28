import { Instruction } from "src/engine/objects";
import LoseGame from "src/engine/script/instructions/lose-game";

describeInstruction("LoseGame", (execute, engine) => {
	it("ends the current story by losing", async done => {
		let instruction = new Instruction({});
		instruction._opcode = LoseGame.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];

		try {
			await execute(instruction);
			expect(false).toBeTrue();
		} catch (e) {
			expect(true).toBeTrue();
		}

		done();
	});
});
