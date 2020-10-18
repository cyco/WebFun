import Expectation, { EngineRef } from "../expectation";
import { not } from "src/util/functional";

class TicksExpectation implements Expectation {
	private _ticks: number;

	public static CanBeBuiltFrom(value: string): boolean {
		return value.contains("ticks");
	}

	public static BuildFrom(it: IteratorResult<string, string>): TicksExpectation {
		return new TicksExpectation(
			it.value
				.split(/[^A-Za-z0-9]+/)
				.map(i => i.trim().parseInt())
				.filter(not(isNaN))
				.first()
		);
	}

	constructor(ticks: number) {
		this._ticks = ticks;
	}

	evaluate(ref: EngineRef): void {
		it(`the proper amount of ticks have been executed`, () => {
			expect(ref.engine.metronome.tickCount).toEqual(this._ticks);
		});
	}

	format(): string {
		return `Elapsed Ticks: ${this._ticks.toString()}`;
	}
}

export default TicksExpectation;
