import PersistentState from "src/engine/persistent-state";

describe("PersistentState", () => {
	let originalSetItem, originalGetItem;
	let storage, state;
	beforeEach(() => {
		storage = {};
		originalSetItem = localStorage.setItem;
		originalGetItem = localStorage.getItem;
		localStorage.setItem = function (key, value) {
			storage[ key ] = value;
		};
		localStorage.getItem = function (key) {
			return storage[ key ];
		};
		state = new PersistentState();
	});

	afterEach(() => {
		localStorage.setItem = originalSetItem;
		localStorage.getItem = originalGetItem;
	});

	it("can store and retrieve a highscore", () => {
		state.highScore = 5;

		expect(state.highScore).toBe(5);
		expect(storage[ "highScore" ]).toBe(5);
	});

	it("can store and retrieve the last score", () => {
		state.lastScore = 5;

		expect(state.lastScore).toBe(5);
		expect(storage[ "lastScore" ]).toBe(5);
	});

	it("can store and retrieve number of won games", () => {
		state.gamesWon = 5;

		expect(state.gamesWon).toBe(5);
		expect(storage[ "gamesWon" ]).toBe(5);
	});

	it("can store and retrieve number of lost games", () => {
		state.gamesLost = 5;

		expect(state.gamesLost).toBe(5);
		expect(storage[ "gamesLost" ]).toBe(5);
	});
});
