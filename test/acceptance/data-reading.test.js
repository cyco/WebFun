import { getFixtureData } from "test-helpers/fixture-loading";
import { GameData, GameTypeIndy, GameTypeYoda, readGameDataFile } from "src/engine";
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
			console.warn(`Unable to find fixture data. Place ${file} into test/fixtures to run this test.`);
			done();
			return;
		}

		expect(() => readGameDataFile(data, type)).not.toThrow();
		done();
	};

	it("reads indy's data without errors", async done => {
		const file = await loadData("indy.data");
		const data = new GameData(readGameDataFile(file, GameTypeIndy));

		expect(data.version).toEqual(512);
		expect(data.sounds.length).toBe(18);
		expect(data.tiles.length).toBe(1144);
		expect(data.puzzles.length).toBe(157);
		expect(data.zones.length).toBe(366);
		expect(data.characters.length).toBe(27);
		expect(data.setupImageData.length).toBe(82944);
		expect(data.copy()).toBeInstanceOf(GameData);
		done();
	});

	it("reads indy's demo data without errors", parsesWithoutError(GameTypeIndy, "indy-demo.data"));
	it("reads yoda's data without errors", parsesWithoutError(GameTypeYoda, "yoda.data"));
	it("reads yoda's demo data without errors", parsesWithoutError(GameTypeYoda, "yoda-demo.data"));
	it("throws an error when the data can not be parsed", async done => {
		const data = await getFixtureData("someData");
		expect(() => readGameDataFile(new InputStream(data), GameTypeYoda)).toThrow();
		expect(() => readGameDataFile(new InputStream(data), GameTypeIndy)).toThrow();
		done();
	});
});
