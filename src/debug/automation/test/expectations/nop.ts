import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class NoOpExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string) {
		return value.contains("nop");
	}

	public static BuildFrom(_: IteratorResult<string>): NoOpExpectation {
		return new NoOpExpectation();
	}

	evaluate(_: GameplayContext) {
		it("does nothing, really", (): void => void 0);
	}

	format() {
		return "NOP";
	}
}

export default NoOpExpectation;
