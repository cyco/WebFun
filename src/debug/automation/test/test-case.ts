import Configuration from "./configuration";
import Expectation from "./expectation";

interface TestCase {
	description: string;
	configuration: Configuration;
	input: string;
	expectations: Expectation[];
}

export default TestCase;
