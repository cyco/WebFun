import Expectation from "../expectation";
import GameplayContext from "../gameplay-context";

class CurrentZoneIsExpectation implements Expectation {
	private _zone: number;

	public static CanBeBuiltFrom(value: string): boolean {
		return value.contains("zone:");
	}

	public static BuildFrom(description: IteratorResult<string>): CurrentZoneIsExpectation {
		return new CurrentZoneIsExpectation(description.value.split(":")[1].trim().parseInt());
	}

	constructor(zone: number) {
		this._zone = zone;
	}

	evaluate(ctx: GameplayContext): void {
		it(`the current zone is ${this._zone.toHex(3)}`, () => {
			expect(ctx.engine.currentZone.id).toBe(this._zone);
		});
	}

	format(): string {
		return `Current zone is ${this._zone.toHex(3)}`;
	}
}

export default CurrentZoneIsExpectation;
