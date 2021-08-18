import Expectation, { EngineRef } from "../expectation";

class HealthIsExpectation implements Expectation {
	private _health: number;

	public static CanBeBuiltFrom(value: string): boolean {
		return value.toLowerCase().contains("health");
	}

	public static BuildFrom(description: IteratorResult<string>): HealthIsExpectation {
		return new HealthIsExpectation(description.value.trim().split(" ").last().parseInt());
	}

	constructor(health: number) {
		this._health = health;
	}

	evaluate(ref: EngineRef): void {
		it(`the hero's health is ${this._health}`, () => {
			expect(ref.engine.hero.health).toBe(this._health);
		});
	}

	format(): string {
		return `Health is ${this._health}`;
	}
}

export default HealthIsExpectation;
