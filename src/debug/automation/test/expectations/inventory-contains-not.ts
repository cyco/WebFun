import expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class InventoryContainsNotExpectation implements expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string) {
		return value.startsWith("inventory") && value.contains("not");
	}

	public static BuildFrom(it: IteratorResult<string, string>): InventoryContainsNotExpectation {
		return new InventoryContainsNotExpectation(
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
		return `Inventory does not contain: ${this.items.map(i => i.toHex(3)).join(", ")}`;
	}

	evaluate(ctx: GameplayContext) {
		it(`hero does not have items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			for (const item of this.items) {
				if (!ctx.engine.inventory.contains(item)) continue;

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
