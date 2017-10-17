import PersistentState from "src/engine/persistent-state.ts";

describe("PersistentState", () => {
	let storage, state;
	beforeEach(() => {
		storage = {};
		const storageMock = {
			setItem(key, value) {
				storage[key] = value;
			},
			getItem(key) {
				return storage[key];
			}
		};
		state = new PersistentState(storageMock);
	});

	it("can store and retrieve a highscore", () => {
		state.highScore = 5;

		expect(state.highScore).toBe(5);
		expect(storage["highScore"]).toEqual("5");
	});

	it("can store and retrieve the last score", () => {
		state.lastScore = 5;

		expect(state.lastScore).toBe(5);
		expect(storage["lastScore"]).toEqual("5");
	});

	it("can store and retrieve number of won games", () => {
		state.gamesWon = 5;

		expect(state.gamesWon).toBe(5);
		expect(storage["gamesWon"]).toEqual("5");
	});

	it("can store and retrieve number of lost games", () => {
		state.gamesLost = 5;

		expect(state.gamesLost).toBe(5);
		expect(storage["gamesLost"]).toEqual("5");
	});
});
