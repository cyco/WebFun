import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";
import { GameState } from "src/engine";

class StorySolvedExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string) {
		return value.contains("story") && value.contains("solved");
	}

	public static BuildFrom(_: IteratorResult<string>): StorySolvedExpectation {
		return new StorySolvedExpectation();
	}

	evaluate(ctx: GameplayContext) {
		it(`the story is solved`, () => {
			expect(ctx.engine.gameState).toBe(GameState.Won);
		});
	}

	format() {
		return "Story Solved";
	}
}

export default StorySolvedExpectation;
