import { Indy, Yoda, GameType } from "src/engine/type";
import { Reader } from "src/engine/save-game";
import { GameData, AssetManager, SaveState } from "src/engine";
import { getFixtureData } from "test/helpers/fixture-loading";
import { InputStream } from "src/util";
import loadGameData from "test/helpers/game-data";
import { Sound, Zone, Tile, Puzzle, Char } from "src/engine/objects";

describe("WebFun.Acceptance.Save game reading", () => {
	let rawYodaData: any;
	let rawIndyData: any;

	beforeAll(async () => {
		rawYodaData = await loadGameData(Yoda);
		rawIndyData = await loadGameData(Indy);
	});

	it("reads yoda's save game format correctly", async () => {
		const { state } = await readSaveGame("save-games/yoda.wld", Yoda);
		expect(state.type).toBe(Yoda);
		expect(state.currentZoneID).toBe(89);
		expect(state.positionOnWorld.x).toBe(0);
		expect(state.positionOnWorld.y).toBe(0);
		expect(state.currentWeapon).toBe(75);
	});

	it("reads indy's save game format correctly", async () => {
		const { state } = await readSaveGame("save-games/indy.wld", Indy);
		expect(state.type).toBe(Indy);
		expect(state.currentZoneID).toBe(120);
		expect(state.positionOnWorld.x).toBe(5);
		expect(state.positionOnWorld.y).toBe(5);
		expect(Array.from(state.inventoryIDs)).toEqual([443, 449]);
	});

	async function readSaveGame(
		game: string,
		type: GameType
	): Promise<{ state: SaveState; assets: AssetManager }> {
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
		return { state: await read(assetManager), assets: assetManager };
	}
});
