import Expectation, { EngineRef } from "../expectation";
import { not } from "src/util/functional";

class InventoryContainsExpectation implements Expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string): boolean {
		return (
			value.contains("inventory") &&
			value.contains("contains") &&
			!value.contains("not") &&
			!value.contains(" is")
		);
	}

	public static BuildFrom(it: IteratorResult<string, string>): InventoryContainsExpectation {
		return new InventoryContainsExpectation(
			it.value
				.split(/[^A-Za-z0-9]+/)
				.map(i => i.trim().parseInt())
				.filter(not(isNaN))
		);
	}

	constructor(items: number[]) {
		this.items = items;
	}

	format(): string {
		return `Inventory contains ${this.items.join(", ")}`;
	}

	evaluate(ref: EngineRef): void {
		it(`hero's inventory contains items ${this.items.join(", ")}`, () => {
			for (const item of this.items) {
				if (ref.engine.inventory.contains(item)) continue;

				const message =
					this.items.length > 1
						? `Expected inventory to contain items ${this.items.join(
								", "
						  )}, but ${item} is missing.`
						: `Expected inventory to contain item ${item}.`;
				fail(message);
			}
		});
	}
}

export default InventoryContainsExpectation;
