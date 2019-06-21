import { Indy, Yoda, GameType } from "src/engine/type";
import { Reader } from "src/engine/save-game";
import { GameData, AssetManager } from "src/engine";
import { getFixtureData } from "test/helpers/fixture-loading";
import { InputStream } from "src/util";
import loadGameData from "test/helpers/game-data";
import { Sound, Zone, Tile, Puzzle, Char } from "src/engine/objects";

describe("WebFun.Acceptance.Save game reading", () => {
	let rawYodaData: any;
	let rawIndyData: any;

	beforeAll(async done => {
		try {
			rawYodaData = await loadGameData(Yoda);
			rawIndyData = await loadGameData(Indy);
		} catch (e) {
			console.error(e);
		} finally {
			done();
		}
	});

	it("reads yoda's save game format correctly", async done => {
		try {
			const state = await readSaveGame("save-games/yoda.wld", Yoda);
			expect(state.type).toBe(Yoda);
			expect(state.currentZoneID).toBe(89);
			expect(state.positionOnWorld.x).toBe(0);
			expect(state.positionOnWorld.y).toBe(0);
			expect(state.currentWeapon).toBe(75);
		} catch (e) {
			expect(e).toBeUndefined();
		} finally {
			done();
		}
	});

	it("reads indy's save game format correctly", async done => {
		try {
			const state = await readSaveGame("save-games/indy.wld", Indy);
			expect(state.type).toBe(Indy);
			expect(state.currentZoneID).toBe(120);
			expect(state.positionOnWorld.x).toBe(5);
			expect(state.positionOnWorld.y).toBe(5);
			expect(Array.from(state.inventoryIDs)).toEqual([443, 449]);
		} catch (e) {
			expect(e).toBeUndefined();
		} finally {
			done();
		}
	});

	async function readSaveGame(game: string, type: GameType) {
		const gameData = new GameData(type === Indy ? rawIndyData : rawYodaData);
		const assetManager = new AssetManager();
		assetManager.populate(Zone, gameData.zones);
		assetManager.populate(Puzzle, gameData.puzzles);
		assetManager.populate(Tile, gameData.tiles);
		assetManager.populate(Sound, gameData.sounds);
		assetManager.populate(Char, gameData.characters);

		const saveData = await getFixtureData(game);
		const saveStream = new InputStream(saveData);

		const { read } = Reader.build(saveStream);
		return await read(assetManager);
	}
});
