import Expectation, { EngineRef } from "../expectation";

class CurrentZoneIsExpectation implements Expectation {
	private _zone: number;

	public static CanBeBuiltFrom(value: string): boolean {
		return (value.contains("zone") && value.contains("is")) || value.contains("zone:");
	}

	public static BuildFrom(description: IteratorResult<string>): CurrentZoneIsExpectation {
		return new CurrentZoneIsExpectation(
			description.value
				.split(" ")
				.map((n: string) => n.parseInt())
				.filter((i: number) => !isNaN(i))[0]
		);
	}

	constructor(zone: number) {
		this._zone = zone;
	}

	evaluate(ref: EngineRef): void {
		it(`the current zone is ${this._zone.toHex(3)}`, () => {
			expect(ref.engine.currentZone.id).toBe(this._zone);
		});
	}

	format(): string {
		return `Current zone is ${this._zone.toHex(3)}`;
	}
}

export default CurrentZoneIsExpectation;
