import expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class InventoryContainsExpectation implements expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string) {
		return value.contains("inventory:");
	}

	public static BuildFrom(it: IteratorResult<string>): InventoryContainsExpectation {
		return new InventoryContainsExpectation(
			it.value
				.split(" ")[1]
				.split(", ")
				.map(i => i.trim())
				.map(i => i.parseInt())
		);
	}

	constructor(items: number[]) {
		this.items = items;
	}

	evaluate(ctx: GameplayContext) {
		it(`hero has items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			this.items.forEach(i => expect(ctx.engine.inventory.contains(i)).toBe(true));
		});
	}
}

export default InventoryContainsExpectation;
