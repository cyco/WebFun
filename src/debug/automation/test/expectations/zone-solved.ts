import Expectation, { EngineRef } from "../expectation";

class ZoneSolvedExpectation implements Expectation {
	public static CanBeBuiltFrom(value: string): boolean {
		return value.contains("solved") && value.contains("zone");
	}

	public static BuildFrom(_: IteratorResult<string>): ZoneSolvedExpectation {
		return new ZoneSolvedExpectation();
	}

	evaluate(ref: EngineRef): void {
		it("the zone is solved", () => {
			const sector = ref.engine.currentWorld.at(4, 4);

			expect(sector.solved1).toBeTrue();
			expect(sector.solved2).toBeTrue();
		});
	}

	format(): string {
		return "Zone solved";
	}
}

export default ZoneSolvedExpectation;
