import Condition from "src/engine/objects/condition";
import ConditionChecker from "src/engine/script/condition-checker";
import { ConditionImplementations as Conditions } from "src/engine/script/conditions";
import { Engine } from "src/engine";

describe("WebFun.Script.ConditionChecker", () => {
	let checker: ConditionChecker, engine: Engine, condition: Condition;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: { location: {} },
			persistentState: {}
		} as any;
		condition = {} as any;
		checker = new ConditionChecker(Conditions, engine);
	});

	it("can be instantiated with or without an engine", () => {
		expect(() => {
			new ConditionChecker(Conditions);
		}).not.toThrow();

		const engineMock: Engine = {} as any;
		expect(() => {
			new ConditionChecker(Conditions, engineMock);
		}).not.toThrow();
	});

	it("has a function to evaluate a single condition", () => {
		expect(typeof checker.check).toBe("function");
	});
});
