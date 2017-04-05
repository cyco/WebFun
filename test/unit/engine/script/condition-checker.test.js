import Condition, { Opcode } from '/engine/objects/condition';
import ConditionChecker from '/engine/script/condition-checker';

describe('ConditionChecker', () => {
	let checker, engine, condition;
	beforeEach(() => {
		engine = {
			state: {
				currentZone: {},
				hero: {}
			},
			persistentState: {}
		};
		condition = new Condition({});
		checker = new ConditionChecker(engine);
	});

	it('can be instantiated with or without an engine', () => {
		expect(() => {
			new ConditionChecker();
		}).not.toThrow();

		let engineMock = {};
		expect(() => {
			new ConditionChecker(engineMock);
		}).not.toThrow();

	});

	it('has a function to evaluate a single condition', () => {
		expect(typeof checker.check).toBe('function');
	});

	describe('opcodes', () => {
		it('Opcode.CounterIs:', () => {
			condition._opcode = Opcode.CounterIs;
			condition._arguments = [5];

			engine.state.currentZone.counter = 5;
			expect(checker.check(condition)).toBe(true);

			engine.state.currentZone.counter = 10;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.CounterIsNot:', () => {
			condition._opcode = Opcode.CounterIsNot;
			condition._arguments = [5];

			engine.state.currentZone.counter = 5;
			expect(checker.check(condition)).toBe(false);

			engine.state.currentZone.counter = 10;
			expect(checker.check(condition)).toBe(true);
		});

		it('Opcode.RandomIs:', () => {
			condition._opcode = Opcode.RandomIs;
			condition._arguments = [5];

			engine.state.currentZone.random = 5;
			expect(checker.check(condition)).toBe(true);

			engine.state.currentZone.random = 10;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.RandomIsNot:', () => {
			condition._opcode = Opcode.RandomIsNot;
			condition._arguments = [5];

			engine.state.currentZone.random = 5;
			expect(checker.check(condition)).toBe(false);

			engine.state.currentZone.random = 10;
			expect(checker.check(condition)).toBe(true);
		});

		it('Opcode.HealthIsLessThan:', () => {
			condition._opcode = Opcode.HealthIsLessThan;
			condition._arguments = [10];

			engine.state.hero.health = 5;
			expect(checker.check(condition)).toBe(true);

			engine.state.hero.health = 10;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.HealthIsGreaterThan:', () => {
			condition._opcode = Opcode.HealthIsGreaterThan;
			condition._arguments = [10];

			engine.state.hero.health = 5;
			expect(checker.check(condition)).toBe(false);

			engine.state.hero.health = 11;
			expect(checker.check(condition)).toBe(true);
		});

		it('Opcode.ZoneNotInitalized:', () => {
			condition._opcode = Opcode.ZoneNotInitalized;

			engine.state.currentZone.actionsInitialized = false;
			expect(checker.check(condition)).toBe(true);

			engine.state.currentZone.actionsInitialized = true;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.ZoneEntered:', () => {
			condition._opcode = Opcode.ZoneEntered;

			engine.state.justEntered = true;
			expect(checker.check(condition)).toBe(true);

			engine.state.justEntered = false;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.EnterByPlane:', () => {
			condition._opcode = Opcode.EnterByPlane;

			engine.state.enteredByPlane = true;
			expect(checker.check(condition)).toBe(true);

			engine.state.enteredByPlane = false;
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.GamesWonIs', () => {
			condition._opcode = Opcode.GamesWonIs;
			condition._arguments = [10];

			engine.persistentState.gamesWon = 5;
			expect(checker.check(condition)).toBe(false);

			engine.persistentState.gamesWon = 10;
			expect(checker.check(condition)).toBe(true);
		});

		it('Opcode.GamesWonIsGreaterThan', () => {
			condition._opcode = Opcode.GamesWonIsGreaterThan;
			condition._arguments = [10];

			engine.persistentState.gamesWon = 5;
			expect(checker.check(condition)).toBe(false);

			engine.persistentState.gamesWon = 10;
			expect(checker.check(condition)).toBe(false);

			engine.persistentState.gamesWon = 11;
			expect(checker.check(condition)).toBe(true);
		});

		it('Opcode.StandingOn', () => {
			let state = engine.state;
			condition._opcode = Opcode.StandingOn;
			condition._arguments = [1, 2, 5];

			state.hero.location = { x: 1, y: 2 };
			state.currentZone.getTileID = () => {
				return 5; };
			expect(checker.check(condition)).toBe(true);

			state.hero.location.x = 2;
			expect(checker.check(condition)).toBe(false);

			state.hero.location.x = 1;
			state.hero.location.y = 3;
			expect(checker.check(condition)).toBe(false);

			state.hero.location = { x: 1, y: 2 };
			state.currentZone.getTileID = () => {
				return 3; };
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.HeroIsAt', () => {
			let state = engine.state;
			condition._opcode = Opcode.HeroIsAt;
			condition._arguments = [1, 2];

			state.hero.location = { x: 1, y: 2 };
			expect(checker.check(condition)).toBe(true);

			state.hero.location = { x: 1, y: 1 };
			expect(checker.check(condition)).toBe(false);
		});


		it('Opcode.TileAtIs', () => {
			let state = engine.state;
			condition._opcode = Opcode.TileAtIs;
			condition._arguments = [10, 5, 7, 2];

			state.currentZone.getTileID = function(x, y, z) {
				if (x === 5 && y === 7 && z === 2) return 10;
				return 7;
			};
			expect(checker.check(condition)).toBe(true);

			condition._arguments = [3, 5, 7, 2];
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.TileAtIsAgain', () => {
			let state = engine.state;
			condition._opcode = Opcode.TileAtIsAgain;
			condition._arguments = [10, 5, 7, 2];

			state.currentZone.getTileID = function(x, y, z) {
				if (x === 5 && y === 7 && z === 2) return 10;
				return 7;
			};
			expect(checker.check(condition)).toBe(true);

			condition._arguments = [3, 5, 7, 2];
			expect(checker.check(condition)).toBe(false);
		});

		it('Opcode.HasItem', () => {
			engine.state.inventory = {
				contains: function(itemID) {
					return itemID === 13;
				}
			};
			condition._opcode = Opcode.HasItem;
			condition._arguments = [13];
			expect(checker.check(condition)).toBe(true);

			condition._arguments = [15];
			expect(checker.check(condition)).toBe(false);
		});
	});
});
