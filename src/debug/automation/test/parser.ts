import TestConfiguration from "./configuration";
import TestExpectation from "./expectation";
import TestCase from "./test-case";
import {
	ZoneSolvedExpectation,
	NOPExpectation,
	InventoryContainsExpectation,
	UnknownExpectation,
	StorySolvedExpectation,
	InventoryContainsNotExpectation
} from "./expectations";
import { Planet, WorldSize } from "src/engine/types";

const Expectations = [
	StorySolvedExpectation,
	ZoneSolvedExpectation,
	NOPExpectation,
	InventoryContainsExpectation,
	InventoryContainsNotExpectation
];
class TestFileParser {
	public static Parse(description: string, fileContents: string): TestCase {
		return new TestFileParser().parse(description, fileContents);
	}

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

	private parseConfiguration(lines: Iterator<string, string>): TestConfiguration {
		const configuration: TestConfiguration = {
			zone: -1,
			findItem: -1,
			requiredItem1: -1,
			requiredItem2: -1,
			npc: -1,
			seed: -1,
			inventory: [],
			planet: -1,
			size: -1,
			tags: []
		};

		do {
			const it = lines.next();
			if (it.done) throw "Unexpected end of input";
			if (!it.value.length) continue;
			if (it.value[0] === "-") break;
			if (it.value[0] === "#") continue;

			const [key, ...valueParts] = it.value
				.split(":")
				.filter(i => i.length)
				.map(i => i.toLowerCase());
			const value = valueParts
				.join(":")
				.split(" ")
				.map(i => i.toLowerCase().trim())
				.join("");

			if (key.contains("zone")) configuration.zone = value.parseInt();
			if (key.contains("seed")) configuration.seed = value.parseInt();
			if (key.contains("planet")) configuration.planet = this.parsePlanet(value);
			if (key.contains("size")) configuration.size = this.parseWorldSize(value);
			if (key.contains("games won")) configuration.gamesWon = value.parseInt();
			if (key.contains("find")) configuration.findItem = value.parseInt();
			if (key.contains("puzzle")) configuration.npc = value.parseInt();
			if (key.contains("require") && configuration.requiredItem1 >= 0)
				configuration.requiredItem2 = value.parseInt();
			if (key.contains("require") && configuration.requiredItem1 < 0)
				configuration.requiredItem1 = value.parseInt();
			if (key.contains("inventory"))
				configuration.inventory = value.split(",").map(i => i.trim().parseInt());
			if (key.contains("tag"))
				configuration.tags = it.value
					.split(":")
					.rest()
					.join(":")
					.split(",")
					.map(i => i.trim())
					.filter(i => i.length);
			if (key.contains("description"))
				configuration.description = it.value
					.split(":")
					.rest()
					.join(":")
					.trim();
		} while (true);

		return configuration;
	}

	private parsePlanet(value: string) {
		switch (value) {
			case "tatooine":
				return Planet.Tatooine.rawValue;
			case "endor":
				return Planet.Endor.rawValue;
			case "hoth":
				return Planet.Hoth.rawValue;
		}
	}

	private parseWorldSize(size: string) {
		switch (size) {
			case "small":
				return WorldSize.Small.rawValue;
			case "medium":
				return WorldSize.Medium.rawValue;
			case "large":
				return WorldSize.Large.rawValue;
		}
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
			if (it.value[0] === "#") continue;
			const value = it.value.toLowerCase();
			const Exp = Expectations.find(e => e.CanBeBuiltFrom(value)) || UnknownExpectation;
			expectations.push(Exp.BuildFrom(it));
		} while (true);
	}
}

export default TestFileParser;
