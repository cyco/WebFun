import Condition from "src/engine/objects/condition";
import ConditionChecker from "src/engine/script/condition-checker";

describe("ConditionChecker", () => {
	let checker, engine, condition;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {location: {}},
			persistentState: {},
			state: {}
		};
		condition = new Condition({});
		checker = new ConditionChecker(engine);
	});

	it("can be instantiated with or without an engine", () => {
		expect(() => {
			new ConditionChecker();
		}).not.toThrow();

		let engineMock = {};
		expect(() => {
			new ConditionChecker(engineMock);
		}).not.toThrow();
	});

	it("has a function to evaluate a single condition", () => {
		expect(typeof checker.check).toBe("function");
	});
});
