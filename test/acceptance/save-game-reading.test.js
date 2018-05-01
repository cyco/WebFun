import loadGameData from "test-helpers/game-data";
import { getFixtureData } from "test-helpers/fixture-loading";
import { Yoda, Indy } from "src/engine/type";
import { InputStream } from "src/util";
import { Reader } from "src/engine/save-game";
import { GameData } from "src/engine";

describe("Save Game Reading", () => {
	it("reads yoda's save game format correctly", async done => {
		const rawGameData = await loadGameData(Yoda);
		const gameData = new GameData(rawGameData);
		const saveData = await getFixtureData("yoda.wld");
		const saveStream = new InputStream(saveData);

		const { type, read } = Reader.build(saveStream);
		const state = read(gameData);
		expect(state.type).toBe(Yoda);
		expect(state.currentZoneID).toBe(89);
		expect(state.positionOnWorld.x).toBe(0);
		expect(state.positionOnWorld.y).toBe(0);
		expect(state.currentWeapon).toBe(75);
		done();
	});

	it("reads indy's save game format correctly", async done => {
		const rawGameData = await loadGameData(Indy);
		const gameData = new GameData(rawGameData);
		const saveData = await getFixtureData("indy.wld");
		const saveStream = new InputStream(saveData);

		const { type, read } = Reader.build(saveStream);
		const state = read(gameData);
		expect(state.type).toBe(Indy);
		expect(state.currentZoneID).toBe(120);
		expect(state.positionOnWorld.x).toBe(5);
		expect(state.positionOnWorld.y).toBe(5);
		expect(Array.from(state.inventoryIDs)).toEqual([443, 449]);
		done();
	});
});
