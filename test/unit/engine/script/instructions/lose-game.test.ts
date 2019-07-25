import { Instruction } from "src/engine/objects";
import LoseGame from "src/engine/script/instructions/lose-game";
import { GameState } from "src/engine";

describeInstruction("LoseGame", (execute, engine) => {
	it("ends the current story by losing", async () => {
		const instruction = new Instruction({ opcode: LoseGame.Opcode, arguments: [0, 1, 2, 3, 4] });

		await execute(instruction);
		expect(engine.gameState).toBe(GameState.Lost);
	});
});
