import expectation from "../expectation";

class InventoryContainsExpectation implements expectation {
	items: number[];

	constructor(items: number[]) {
		this.items = items;
	}
}

export default InventoryContainsExpectation;
