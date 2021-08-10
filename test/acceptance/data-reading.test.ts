import { getFixtureData } from "test/helpers/fixture-loading";
import { Variant, readGameDataFile } from "src/engine";
import { InputStream } from "src/util";
import { Yoda, Indy } from "src/variant";

describe("WebFun.Acceptance.DataReading", () => {
	const loadData = async (file: string): Promise<InputStream> => {
		return new Promise(resolve => {
			getFixtureData(file, result => {
				resolve(result && result.byteLength > 9 ? new InputStream(result) : null);
			});
		});
	};

	const parsesWithoutError = (variant: Variant, file: string) => async () => {
		const data = await loadData(file);
		if (!data) {
			console.warn(
				`Unable to find fixture data. Place ${file} into test/fixtures to run this test.`
			);
			return;
		}

		expect(() => readGameDataFile(data, variant)).not.toThrow();
	};

	it("reads indy's data without errors", async () => {
		const file = await loadData("indy.data");
		const data = readGameDataFile(file, Indy);

		expect(data.version).toEqual(512);
		expect(data.sounds.length).toBe(18);
		expect(data.tiles.length).toBe(1144);
		expect(data.puzzles.length).toBe(157);
		expect(data.zones.length).toBe(366);
		expect(data.characters.length).toBe(27);
		expect(data.startup.length).toBe(82944);
	});

	it("reads indy's demo data without errors", parsesWithoutError(Indy, "indy-demo.data"));
	it("reads yoda's data without errors", parsesWithoutError(Yoda, "yoda.data"));
	it("reads yoda's demo data without errors", parsesWithoutError(Yoda, "yoda-demo.data"));
	it("throws an error when the data can not be parsed", async () => {
		const data = await getFixtureData("someData");
		expect(() => readGameDataFile(new InputStream(data), Yoda)).toThrow();
		expect(() => readGameDataFile(new InputStream(data), Indy)).toThrow();
	});
});
