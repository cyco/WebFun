import TestConfiguration from "./test-configuration";
import TestExpectation from "./test-expectation";

interface TestCase {
	description: string;
	configuration: TestConfiguration;
	input: string;
	expectations: TestExpectation[];
}

export default TestCase;
