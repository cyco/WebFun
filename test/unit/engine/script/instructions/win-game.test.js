import { Instruction } from "src/engine/objects";
import * as WinGame from "src/engine/script/instructions/win-game";

describeInstruction("WinGame", (execute, engine) => {
	it("ends the current story by winning", () => {
		let instruction = new Instruction({});
		instruction._opcode = WinGame.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];

		expect(() => execute(instruction)).toThrow("Game Won!");
	});
});
