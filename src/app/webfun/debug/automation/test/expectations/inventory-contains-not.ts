import { not } from "src/util/functional";
import Expectation, { EngineRef } from "../expectation";

class InventoryContainsNotExpectation implements Expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string): boolean {
		return value.startsWith("inventory") && value.contains("not");
	}

	public static BuildFrom(it: IteratorResult<string, string>): InventoryContainsNotExpectation {
		return new InventoryContainsNotExpectation(
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
		return `Inventory does not contain ${this.items.map(i => i.toHex(3)).join(", ")}`;
	}

	evaluate(ref: EngineRef): void {
		it(`hero does not have items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			for (const item of this.items) {
				if (!ref.engine.inventory.contains(item)) continue;

				const message =
					this.items.length > 1
						? `Expected inventory not to contain items ${this.items
								.map(i => i.toHex(3))
								.join(", ")}, but ${item.toHex(3)} is there.`
						: `Expected inventory not to contain item ${item.toHex(3)}.`;
				fail(message);
			}
		});
	}
}

export default InventoryContainsNotExpectation;
