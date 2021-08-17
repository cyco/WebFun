import Expectation, { EngineRef } from "../expectation";
import { not } from "src/util/functional";

class InventoryIs implements Expectation {
	private items: number[];

	public static CanBeBuiltFrom(value: string): boolean {
		value = value.toLowerCase();
		return (
			value.contains("inventory") &&
			(value.contains("is") || value.startsWith("inventory:")) &&
			!value.contains("not") &&
			!value.contains("contains")
		);
	}

	public static BuildFrom(it: IteratorResult<string, string>): InventoryIs {
		return new InventoryIs(
			it.value
				.split(/[^A-Za-z0-9]+/)
				.map(i => i.trim().parseInt())
				.filter(not(isNaN))
		);
	}

	constructor(items: number[]) {
		this.items = items.sort();
	}

	format(): string {
		return `Inventory is ${this.items.map(i => i.toHex(3)).join(", ")}`;
	}

	evaluate(ref: EngineRef): void {
		it(`hero has items ${this.items.map(i => i.toHex(3)).join(", ")}`, () => {
			const actualItems = ref.engine.inventory.items.map(i => i.id).sort();
			if (actualItems.length !== this.items.length) {
				const message = `Expected inventory to contain excatly ${this.items.length} items but it has
				${actualItems.length}`;
				fail(message);
				return;
			}

			for (let i = 0; i < actualItems.length; i++) {
				if (actualItems[i] === this.items[i]) continue;

				const message = `Expected inventory to be ${this.items.join(
					", "
				)}  but it is ${actualItems.join(", ")}`;
				fail(message);
				return;
			}
		});
	}
}

export default InventoryIs;
