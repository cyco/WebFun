import "src/engine";
import loadGameData from "test-helpers/game-data";
import { getFixtureData } from "test-helpers/fixture-loading";
import SaveGameReader from "src/engine/save-game/reader.ts";
import SaveGameWriter from "src/engine/save-game/writer.ts";
import GameData from "src/engine/game-data";
import { InputStream, OutputStream } from "src/util";

describe("Save Game IO", () => {
	let data, state, inputStream;

	describe("simple world", () => {
		beforeAll((done) => {
			loadGameData(rawData => {
				data = new GameData(rawData);

				getFixtureData("savegame.wld", function (file) {
					inputStream = new InputStream(file);
					done();
				});
			});
		});

		it("reads save games correctly", () => {
			const saveGameReader = new SaveGameReader(data);
			state = saveGameReader.read(inputStream);

			expect(state.currentZoneID).toBe(93);
			expect(state.currentWeapon).toBe(-1);
			expect(state.goalPuzzle).toBe(103);
		});

		it("writes save game correctly", () => {
			const outputStream = new OutputStream(inputStream.length);
			const saveGameWriter = new SaveGameWriter(data);
			saveGameWriter.write(state, outputStream);
			expect(outputStream.offset).toBe(inputStream.length);
		});
	});

	xdescribe("world including npcs", () => {
		beforeAll((done) => {
			loadGameData(rawData => {
				data = new GameData(rawData);

				getFixtureData("savegame_including_npcs.wld", function (file) {
					inputStream = new InputStream(file);
					done();
				});
			});
		});

		it("reads save games correctly", () => {
			const saveGameReader = new SaveGameReader(data);
			state = saveGameReader.read(inputStream);

			expect(state.currentZoneID).toBe(93);
			expect(state.currentWeapon).toBe(-1);
			expect(state.goalPuzzle).toBe(103);
			expect(state.inventoryIDs.length).toBe(10);
		});

		it("writes save game correctly", () => {
			const outputStream = new OutputStream(inputStream.length);
			const saveGameWriter = new SaveGameWriter(data);
			saveGameWriter.write(state, outputStream);
			expect(outputStream.offset).toBe(inputStream.length);
		});
	});
});
