import Condition, { Opcode } from '/engine/objects/condition';
import ConditionChecker from '/engine/script/condition-checker';

describe('ConditionChecker', () => {
	let checker, engine, condition;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: { location: {} },
			persistentState: {},
			state: {}
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

			engine.currentZone.counter = 5;
			expect(checker.check(condition)).toBeTrue();

			engine.currentZone.counter = 10;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.CounterIsNot:', () => {
			condition._opcode = Opcode.CounterIsNot;
			condition._arguments = [5];

			engine.currentZone.counter = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.counter = 10;
			expect(checker.check(condition)).toBeTrue();
		});

		it('Opcode.RandomIs:', () => {
			condition._opcode = Opcode.RandomIs;
			condition._arguments = [5];

			engine.currentZone.random = 5;
			expect(checker.check(condition)).toBeTrue();

			engine.currentZone.random = 10;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.RandomIsNot:', () => {
			condition._opcode = Opcode.RandomIsNot;
			condition._arguments = [5];

			engine.currentZone.random = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.random = 10;
			expect(checker.check(condition)).toBeTrue();
		});

		it('Opcode.HealthIsLessThan:', () => {
			condition._opcode = Opcode.HealthIsLessThan;
			condition._arguments = [10];

			engine.hero.health = 5;
			expect(checker.check(condition)).toBeTrue();

			engine.hero.health = 10;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.HealthIsGreaterThan:', () => {
			condition._opcode = Opcode.HealthIsGreaterThan;
			condition._arguments = [10];

			engine.hero.health = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.hero.health = 11;
			expect(checker.check(condition)).toBeTrue();
		});

		it('Opcode.ZoneNotInitalized:', () => {
			condition._opcode = Opcode.ZoneNotInitalized;

			engine.currentZone.actionsInitialized = false;
			expect(checker.check(condition)).toBeTrue();

			engine.currentZone.actionsInitialized = true;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.ZoneEntered:', () => {
			condition._opcode = Opcode.ZoneEntered;

			engine.state.justEntered = true;
			expect(checker.check(condition)).toBeTrue();

			engine.state.justEntered = false;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.EnterByPlane:', () => {
			condition._opcode = Opcode.EnterByPlane;

			engine.state.enteredByPlane = true;
			expect(checker.check(condition)).toBeTrue();

			engine.state.enteredByPlane = false;
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.GamesWonIs', () => {
			condition._opcode = Opcode.GamesWonIs;
			condition._arguments = [10];

			engine.persistentState.gamesWon = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.persistentState.gamesWon = 10;
			expect(checker.check(condition)).toBeTrue();
		});

		it('Opcode.GamesWonIsGreaterThan', () => {
			condition._opcode = Opcode.GamesWonIsGreaterThan;
			condition._arguments = [10];

			engine.persistentState.gamesWon = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.persistentState.gamesWon = 10;
			expect(checker.check(condition)).toBeFalse();

			engine.persistentState.gamesWon = 11;
			expect(checker.check(condition)).toBeTrue();
		});

		it('Opcode.StandingOn', () => {
			const hero = engine.hero;
			condition._opcode = Opcode.StandingOn;
			condition._arguments = [1, 2, 5];

			hero.location = { x: 1, y: 2 };
			engine.currentZone.getTileID = () => {
				return 5;
			};
			expect(checker.check(condition)).toBeTrue();

			hero.location.x = 2;
			expect(checker.check(condition)).toBeFalse();

			hero.location.x = 1;
			hero.location.y = 3;
			expect(checker.check(condition)).toBeFalse();

			hero.location = { x: 1, y: 2 };
			engine.currentZone.getTileID = () => {
				return 3;
			};
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.HeroIsAt', () => {
			const hero = engine.hero;
			condition._opcode = Opcode.HeroIsAt;
			condition._arguments = [1, 2];

			hero.location = { x: 1, y: 2 };
			expect(checker.check(condition)).toBeTrue();

			hero.location = { x: 1, y: 1 };
			expect(checker.check(condition)).toBeFalse();
		});


		it('Opcode.TileAtIs', () => {
			condition._opcode = Opcode.TileAtIs;
			condition._arguments = [10, 5, 7, 2];

			engine.currentZone.getTileID = function(x, y, z) {
				if (x === 5 && y === 7 && z === 2) return 10;
				return 7;
			};
			expect(checker.check(condition)).toBeTrue();

			condition._arguments = [3, 5, 7, 2];
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.TileAtIsAgain', () => {
			condition._opcode = Opcode.TileAtIsAgain;
			condition._arguments = [10, 5, 7, 2];

			engine.currentZone.getTileID = function(x, y, z) {
				if (x === 5 && y === 7 && z === 2) return 10;
				return 7;
			};
			expect(checker.check(condition)).toBeTrue();

			condition._arguments = [3, 5, 7, 2];
			expect(checker.check(condition)).toBeFalse();
		});

		it('Opcode.HasItem', () => {
			engine.inventory = {
				contains: function(itemID) {
					return itemID === 13;
				}
			};
			condition._opcode = Opcode.HasItem;
			condition._arguments = [13];
			expect(checker.check(condition)).toBeTrue();

			condition._arguments = [15];
			expect(checker.check(condition)).toBeFalse();
		});
		
		it('Opcode.PaddingIs:', () => {
			condition._opcode = Opcode.PaddingIs;
			condition._arguments = [5];

			engine.currentZone.padding = 5;
			expect(checker.check(condition)).toBeTrue();

			engine.currentZone.padding = 10;
			expect(checker.check(condition)).toBeFalse();
		});
		
		it('Opcode.PaddingIsGreaterThan:', () => {
			condition._opcode = Opcode.PaddingIsGreaterThan;
			condition._arguments = [5];

			engine.currentZone.padding = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.padding = 10;
			expect(checker.check(condition)).toBeTrue();
		});
		
		it('Opcode.PaddingIsLessThan:', () => {
			condition._opcode = Opcode.PaddingIsLessThan;
			condition._arguments = [5];

			engine.currentZone.padding = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.padding = 4;
			expect(checker.check(condition)).toBeTrue();
		});
		
		it('Opcode.PaddingIsNot:', () => {
			condition._opcode = Opcode.PaddingIsNot;
			condition._arguments = [5];

			engine.currentZone.padding = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.padding = 10;
			expect(checker.check(condition)).toBeTrue();
		});
		
		it('Opcode.RandomIsGreaterThan:', () => {
			condition._opcode = Opcode.RandomIsGreaterThan;
			condition._arguments = [5];

			engine.currentZone.random = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.random = 10;
			expect(checker.check(condition)).toBeTrue();
		});
		
		it('Opcode.RandomIsLessThan:', () => {
			condition._opcode = Opcode.RandomIsLessThan;
			condition._arguments = [5];

			engine.currentZone.random = 5;
			expect(checker.check(condition)).toBeFalse();

			engine.currentZone.random = 4;
			expect(checker.check(condition)).toBeTrue();
		});
	});
});
