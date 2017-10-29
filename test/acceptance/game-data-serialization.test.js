import "src/engine";
import GameData from "src/engine/game-data";
import loadGameData from "test-helpers/game-data";
import GameDataSerializer from "src/editor/game-data-serializer";
import DiscardingOutputStream from "src/util/discarding-output-stream";

describe("Game Data Serialization", () => {
	let data;

	beforeAll((done) => {
		loadGameData(rawData => {
			data = new GameData(rawData);
			done();
		});
	});

	it("writes all the bytes needed", () => {
		const stream = new DiscardingOutputStream();
		const serializer = new GameDataSerializer();
		serializer.serialize(data, stream);

		expect(stream.offset).toBe(4603252);
	});
});
