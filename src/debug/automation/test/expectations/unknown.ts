import Expectation from "../expectation";

class UnknownExpectation implements Expectation {
	line: string;

	constructor(line: string) {
		this.line = line;
	}
}

export default UnknownExpectation;
