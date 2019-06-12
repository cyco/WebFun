import TestConfiguration from "./test-configuration";
import TestExpectation from "./test-expectation";
import TestCase from "./test-case";
import { NOPExpectation, InventoryContainsExpectation, UnknownExpectation } from "./expectations";

class TestFileParser {
	public parse(description: string, fileContents: string): TestCase {
		const testCase = this.doParse(fileContents);
		testCase.description = description;
		return testCase as TestCase;
	}

	public async parseFile(file: string): Promise<TestCase> {
		const input = (await getFixtureData(file)).readString();
		return this.parse(file, input);
	}

	private doParse(input: string): Partial<TestCase> {
		const lines = input.split("\n").values();
		lines.next();

		return {
			configuration: this.parseConfiguration(lines),
			input: this.parseInput(lines),
			expectations: this.parseExpectations(lines)
		};
	}

	private parseConfiguration(lines: IterableIterator<string>): TestConfiguration {
		const configuration: TestConfiguration = {
			zone: -1,
			findItem: -1,
			requiredItem1: -1,
			requiredItem2: -1,
			puzzleNPC: -1,
			seed: -1,
			inventory: []
		};

		do {
			const it = lines.next();
			if (it.done) throw "Unexpected end of input";
			if (!it.value.length) continue;
			if (it.value[0] === "-") return configuration;

			const [key, value] = it.value
				.split(" ")
				.filter(i => i.length)
				.map(i => i.toLowerCase());

			if (key.contains("zone")) configuration.zone = value.parseInt();
			if (key.contains("seed")) configuration.seed = value.parseInt();
			if (key.contains("find")) configuration.findItem = value.parseInt();
			if (key.contains("puzzle")) configuration.puzzleNPC = value.parseInt();
			if (key.contains("require") && configuration.requiredItem1 < 0)
				configuration.requiredItem2 = value.parseInt();
			if (key.contains("require") && configuration.requiredItem1 < 0)
				configuration.requiredItem1 = value.parseInt();
			if (key.contains("inventory"))
				configuration.inventory = value.split(",").map(i => i.trim().parseInt());
		} while (true);

		return configuration;
	}

	private parseInput(lines: IterableIterator<string>): string {
		const inputLines: string[] = ["."];
		do {
			const it = lines.next();
			if (it.done) throw "Unexpected end of input";
			if (!it.value.length) continue;
			if (it.value[0] === "-") return inputLines.map(l => l.trim()).join("");
			inputLines.push(it.value);
		} while (true);
	}

	private parseExpectations(lines: IterableIterator<string>): TestExpectation[] {
		const expectations: TestExpectation[] = [];

		do {
			const it = lines.next();
			if (it.done) return expectations;
			if (!it.value.length) continue;
			if (it.value.toLowerCase().contains("nop")) {
				expectations.push(new NOPExpectation());
			} else if (it.value.toLowerCase().contains("inventory:")) {
				expectations.push(
					new InventoryContainsExpectation(
						it.value
							.split(" ")[1]
							.split(", ")
							.map(i => i.trim())
							.map(i => i.parseInt())
					)
				);
			} else {
				expectations.push(new UnknownExpectation(it.value));
			}
		} while (true);
	}
}

export default TestFileParser;
