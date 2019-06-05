import { Indy, Yoda } from "src/engine/type";
import { Reader } from "src/engine/save-game";
import { GameData } from "src/engine";
import { getFixtureData } from "test-helpers/fixture-loading";
import { InputStream } from "src/util";
import loadGameData from "test-helpers/game-data";

describe("WebFun.Acceptance.Save game reading", () => {
	let rawYodaData;
	let rawIndyData;

	beforeAll(async done => {
		rawYodaData = await loadGameData(Yoda);
		rawIndyData = await loadGameData(Indy);

		done();
	});

	it("reads yoda's save game format correctly", async done => {
		const state = await readSaveGame("save-games/yoda.wld", Yoda);
		expect(state.type).toBe(Yoda);
		expect(state.currentZoneID).toBe(89);
		expect(state.positionOnWorld.x).toBe(0);
		expect(state.positionOnWorld.y).toBe(0);
		expect(state.currentWeapon).toBe(75);
		done();
	});

	it("reads indy's save game format correctly", async done => {
		const state = await readSaveGame("save-games/indy.wld", Indy);
		expect(state.type).toBe(Indy);
		expect(state.currentZoneID).toBe(120);
		expect(state.positionOnWorld.x).toBe(5);
		expect(state.positionOnWorld.y).toBe(5);
		expect(Array.from(state.inventoryIDs)).toEqual([443, 449]);
		done();
	});

	async function readSaveGame(game, type) {
		const gameData = new GameData(type === Indy ? rawIndyData : rawYodaData);
		const saveData = await getFixtureData(game);
		const saveStream = new InputStream(saveData);

		const { read } = Reader.build(saveStream);
		return await read(gameData);
	}
});
