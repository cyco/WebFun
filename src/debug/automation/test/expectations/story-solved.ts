import Expectation, { EngineRef } from "../expectation";
import { GameState } from "src/engine";

class StorySolvedExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string): boolean {
		return (
			(value.contains("story") && value.contains("solved")) ||
			(value.contains("game") && value.contains("won"))
		);
	}

	public static BuildFrom(_: IteratorResult<string>): StorySolvedExpectation {
		return new StorySolvedExpectation();
	}

	evaluate(ref: EngineRef): void {
		it(`the story is solved`, () => {
			expect(ref.engine.gameState).toBe(GameState.Won);
		});
	}

	format(): string {
		return "Story solved";
	}
}

export default StorySolvedExpectation;
