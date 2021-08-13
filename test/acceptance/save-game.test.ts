import { Indy, Yoda } from "src/variant";
import { Reader, Writer } from "src/engine/save-game";
import { AssetManager, SaveState, Variant } from "src/engine";
import { getFixtureData } from "test/helpers/fixture-loading";
import { InputStream, DiscardingOutputStream, OutputStream } from "src/util";
import loadGameData from "test/helpers/game-data";
import { Sound, Zone, Tile, Puzzle, Character } from "src/engine/objects";
import { Data } from "src/engine/file-format";

describe("WebFun.Acceptance.Save Games", () => {
	let rawYodaData: Data;
	let rawIndyData: Data;

	beforeAll(async () => {
		rawYodaData = await loadGameData(Yoda);
		rawIndyData = await loadGameData(Indy);
	});

	afterAll(() => {
		rawYodaData = null;
		rawIndyData = null;
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

	it("writes save games correctly", async () => {
		const { state } = await readSaveGame("save-games/yoda.wld", Yoda);
		const outputStream = writeSaveGame(state);
		expect(outputStream.buffer.byteLength).toEqual(76065);
	});

	async function readSaveGame(
		game: string,
		type: Variant
	): Promise<{ state: SaveState; assets: AssetManager }> {
		const data = type === Indy ? rawIndyData : rawYodaData;
		const assets = new AssetManager();

		assets.populate(Uint8Array, [data.startup]);
		assets.populate(
			Sound,
			data.sounds.map((s, idx) => new Sound(idx, s))
		);
		assets.populate(
			Tile,
			data.tiles.map((t, idx) => new Tile(idx, t))
		);
		assets.populate(
			Puzzle,
			data.puzzles.map((p, idx) => new Puzzle(idx, p, assets))
		);
		assets.populate(
			Character,
			data.characters.map((c, idx) => new Character(idx, c, assets))
		);
		assets.populate(
			Zone,
			data.zones.map((z, idx) => new Zone(idx, z, assets))
		);

		const saveData = await getFixtureData(game);
		const saveStream = new InputStream(saveData);

		const { read } = Reader.build(saveStream);
		return { state: read(assets), assets: assets };
	}

	function writeSaveGame(state: SaveState): OutputStream {
		const writer = new Writer();
		const sizeStream = new DiscardingOutputStream();
		writer.write(state, sizeStream);
		const stream = new OutputStream(sizeStream.offset);
		writer.write(state, stream);
		return stream;
	}
});
