import "src/engine";
import GameData from "src/engine/game-data";
import SaveGameReader from "src/engine/save-game/reader.ts";
import SaveGameWriter from "src/engine/save-game/writer.ts";
import { InputStream, OutputStream } from "src/util";
import { getFixtureData } from "test-helpers/fixture-loading";
import loadGameData from "test-helpers/game-data";
import { Yoda } from "src/engine";
import { Planet } from "src/engine/types";

describe("Save Game IO", () => {
	let data, state, inputStream;

	describe("simple world", () => {
		beforeAll(done => {
			loadGameData(rawData => {
				data = new GameData(rawData);

				getFixtureData("savegame.wld", function(file) {
					inputStream = new InputStream(file);
					done();
				});
			});
		});

		it("reads save games correctly", () => {
			const saveGameReader = new SaveGameReader(data);
			state = saveGameReader.read(inputStream);
			expect(state.seed).toBe(0xbf87);
			expect(state.planet).toBe(Planet.HOTH);
			expect(state.currentWeapon).toBe(Yoda.WeaponID.Blaster);
		});
	});
});
