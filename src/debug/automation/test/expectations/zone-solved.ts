import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class ZoneSolvedExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string): boolean {
		return value.contains("solved");
	}

	public static BuildFrom(_: IteratorResult<string>): ZoneSolvedExpectation {
		return new ZoneSolvedExpectation();
	}

	evaluate(ctx: GameplayContext): void {
		it("the zone is solved", () => {
			expect(ctx.engine.currentWorld.at(4, 4).solved1).toBeTrue();
			expect(ctx.engine.currentWorld.at(4, 4).solved2).toBeTrue();
		});
	}

	format(): string {
		return "Zone solved";
	}
}

export default ZoneSolvedExpectation;
