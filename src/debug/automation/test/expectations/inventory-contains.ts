import expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class InventoryContainsExpectation implements expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string) {
		return value.contains("inventory:") && !value.contains("not");
	}

	public static BuildFrom(it: IteratorResult<string, string>): InventoryContainsExpectation {
		return new InventoryContainsExpectation(
			it.value
				.split(":")[1]
				.split(", ")
				.map(i => i.trim())
				.map(i => i.parseInt())
		);
	}

	constructor(items: number[]) {
		this.items = items;
	}

	format(): string {
		return `Inventory: ${this.items.map(i => i.toHex(3)).join(", ")}`;
	}

	evaluate(ctx: GameplayContext) {
		it(`hero has items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			for (const item of this.items) {
				if (ctx.engine.inventory.contains(item)) continue;

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
