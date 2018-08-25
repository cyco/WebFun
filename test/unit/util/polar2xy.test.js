import polar2xy from "src/util/polar2xy";
import { PI } from "src/std.math";

describe("WebFun.Util.polar2xy", () => {
	it("converts coordinates from polar to cartesian coordinates", () => {
		let x, y;

		[x, y] = polar2xy(0, 0);
		expect(x).toBeCloseTo(0, 0.1);
		expect(y).toBeCloseTo(0, 0.1);

		[x, y] = polar2xy(1, 0);
		expect(x).toBeCloseTo(1, 0.1);
		expect(y).toBeCloseTo(0, 0.1);

		[x, y] = polar2xy(1, PI);
		expect(x).toBeCloseTo(-1, 0.1);
		expect(y).toBeCloseTo(0, 0.1);

		[x, y] = polar2xy(1, (1 / 2) * PI);
		expect(x).toBeCloseTo(0, 0.1);
		expect(y).toBeCloseTo(-1, 0.1);

		[x, y] = polar2xy(1, 1.5 * PI);
		expect(x).toBeCloseTo(0, 0.1);
		expect(y).toBeCloseTo(1, 0.1);

		[x, y] = polar2xy(1, 2 * PI);
		expect(x).toBeCloseTo(1, 0.1);
		expect(y).toBeCloseTo(0, 0.1);

		[x, y] = polar2xy(5, 0.5 * PI);
		expect(x).toBeCloseTo(0, 0.1);
		expect(y).toBeCloseTo(-5, 0.1);
	});
});
