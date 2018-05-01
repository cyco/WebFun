import { getFixtureData } from "test-helpers/fixture-loading";
import { ManualDataFileReader, GameTypeYoda, GameTypeIndy } from "src/engine";
import { InputStream } from "src/util";

describe("DataReading", () => {
	const loadData = async file => {
		return new Promise((resolve, reject) => {
			getFixtureData(file, result => {
				resolve(result && result.byteLength > 9 ? new InputStream(result) : null);
			});
		});
	};

	const parsesWithoutError = (type, file) => async done => {
		const data = await loadData(file);
		if (!data) {
			console.warn(
				`Unable to find fixture data. Place ${file} into test/fixtures to run this test.`
			);
			done();
			return;
		}

		expect(() => ManualDataFileReader(data, type)).not.toThrow();
		done();
	};

	it("reads indy's data without errors", parsesWithoutError(GameTypeIndy, "indy.data"));
	it("reads indy's demo data without errors", parsesWithoutError(GameTypeIndy, "indy-demo.data"));
	it("reads yoda's data without errors", parsesWithoutError(GameTypeYoda, "yoda.data"));
	it("reads yoda's demo data without errors", parsesWithoutError(GameTypeYoda, "yoda-demo.data"));
	it("throws an error when the data can not be parsed", async done => {
		const data = await getFixtureData("someData");
		expect(() => ManualDataFileReader(new InputStream(data), GameTypeYoda)).toThrow();
		expect(() => ManualDataFileReader(new InputStream(data), GameTypeIndy)).toThrow();
		done();
	});
});
