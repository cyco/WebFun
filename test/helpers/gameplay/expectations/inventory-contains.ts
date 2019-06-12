import TestExpectation from "../test-expectation";

class InventoryContainsExpectation implements TestExpectation {
	items: number[];

	constructor(items: number[]) {
		this.items = items;
	}
}

export default InventoryContainsExpectation;
