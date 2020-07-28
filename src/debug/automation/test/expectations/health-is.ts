import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class HealthIsExpectation implements Expectation {
	private _health: number;

	public static CanBeBuiltFrom(value: string) {
		return value.contains("health");
	}

	public static BuildFrom(description: IteratorResult<string>): HealthIsExpectation {
		return new HealthIsExpectation(description.value.split(" ").last().trim().parseInt());
	}

	constructor(health: number) {
		this._health = health;
	}

	evaluate(ctx: GameplayContext) {
		it(`the hero's health is ${this._health.toHex(3)}`, () => {
			expect(ctx.engine.hero.health).toBe(this._health);
		});
	}

	format() {
		return `Current health is not ${this._health.toHex(3)}`;
	}
}

export default HealthIsExpectation;
