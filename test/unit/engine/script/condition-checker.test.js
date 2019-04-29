import Condition from "src/engine/objects/condition";
import ConditionChecker from "src/engine/script/condition-checker";
import Conditions from "src/engine/script/conditions";

describe("ConditionChecker", () => {
	let checker, engine, condition;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: { location: {} },
			persistentState: {},
			temporaryState: {}
		};
		condition = new Condition({});
		checker = new ConditionChecker(Conditions, engine);
	});

	it("can be instantiated with or without an engine", () => {
		expect(() => {
			new ConditionChecker();
		}).not.toThrow();

		const engineMock = {};
		expect(() => {
			new ConditionChecker(engineMock);
		}).not.toThrow();
	});

	it("has a function to evaluate a single condition", () => {
		expect(typeof checker.check).toBe("function");
	});
});
