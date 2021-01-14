import expectation, { EngineRef } from "../expectation";
import { not } from "src/util/functional";

class InventoryContainsExpectation implements expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string): boolean {
		return value.contains("inventory") && !value.contains("not");
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
		return `Inventory: ${this.items.map(i => i.toHex(3)).join(", ")}`;
	}

	evaluate(ref: EngineRef): void {
		it(`hero has items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			for (const item of this.items) {
				if (ref.engine.inventory.contains(item)) continue;

				const message =
					this.items.length > 1
						? `Expected inventory to contain items ${this.items
								.map(i => i.toHex(3))
								.join(", ")}, but ${item.toHex(3)} is missing.`
						: `Expected inventory to contain item ${item.toHex(3)}.`;
				fail(message);
			}
		});
	}
}

export default InventoryContainsExpectation;
