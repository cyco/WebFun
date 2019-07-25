import { Condition } from "src/engine/objects";
import GameWon from "src/engine/script/conditions/game-won";
import GameState from "src/engine/game-state";

describeCondition("GameWon", (check, engine) => {
	it("evaluates to true if the story has been completed already", async () => {
		const condition = new Condition({ opcode: GameWon.Opcode });

		engine.gameState = GameState.Won;
		expect(await check(condition)).toBeTrue();

		engine.gameState = GameState.Lost;
		expect(await check(condition)).toBeFalse();

		engine.gameState = GameState.Running;
		expect(await check(condition)).toBeFalse();
	});
});
