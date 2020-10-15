import Expectation from "../expectation";

class UnknownExpectation implements Expectation {
	private line: string;

	public static CanBeBuiltFrom(_: string): boolean {
		return true;
	}

	public static BuildFrom(it: IteratorResult<string>): UnknownExpectation {
		return new UnknownExpectation(it.value);
	}

	constructor(line: string) {
		this.line = line;
	}

	evaluate(): void {
		throw `Don't know how to handle expectation ${this.line}`;
	}

	format(): string {
		return this.line;
	}
}

export default UnknownExpectation;
