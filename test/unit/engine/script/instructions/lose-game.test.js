import { Instruction } from "src/engine/objects";
import * as LoseGame from "src/engine/script/instructions/lose-game";

describeInstruction("LoseGame", (execute, engine) => {
	it("ends the current story by losing", () => {
		let instruction = new Instruction({});
		instruction._opcode = LoseGame.Opcode;
		instruction._arguments = [ 0, 1, 2, 3, 4 ];

		expect(() => execute(instruction)).toThrow("Game Lost!");
	});
});
