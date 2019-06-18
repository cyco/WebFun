import {
	NOPExpectation,
	InventoryContainsExpectation,
	ZoneSolvedExpectation,
	Expectation
} from "src/debug/automation/test";

export default (expectation: Expectation): string => {
	if (expectation instanceof ZoneSolvedExpectation) {
		return "Solved";
	}

	if (expectation instanceof NOPExpectation) {
		return "NOP";
	}

	if (expectation instanceof InventoryContainsExpectation) {
		return `Inventory: ${expectation.items.map(i => i.toHex(3)).join(", ")}`;
	}

	throw new Error("Unknown expectation can not be formatted");
};
