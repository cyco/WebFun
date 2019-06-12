import TestExpectation from "../test-expectation";

class UnknownExpectation implements TestExpectation {
	line: string;

	constructor(line: string) {
		this.line = line;
	}
}

export default UnknownExpectation;
