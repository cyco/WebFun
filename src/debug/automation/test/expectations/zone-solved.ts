import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class ZoneSolvedExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string) {
		return value.contains("solved");
	}

	public static BuildFrom(_: IteratorResult<string>): ZoneSolvedExpectation {
		return new ZoneSolvedExpectation();
	}

	evaluate(ctx: GameplayContext) {
		it("the zone is solved", () => {
			expect(ctx.engine.currentWorld.at(4, 4).zone.solved).toBeTrue();
		});
	}
}

export default ZoneSolvedExpectation;
