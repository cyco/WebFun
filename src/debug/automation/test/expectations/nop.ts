import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class UnknownExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string) {
		return value.contains("nop");
	}

	public static BuildFrom(_: IteratorResult<string>): UnknownExpectation {
		return new UnknownExpectation();
	}

	evaluate(_: GameplayContext) {
		it("does nothing, really", (): void => void 0);
	}

	format() {
		return "NOP";
	}
}

export default UnknownExpectation;
