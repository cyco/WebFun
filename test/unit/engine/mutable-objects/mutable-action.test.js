import Action from "src/engine/mutable-objects/mutable-action";

describe("WebFun.Engine.MutableObjecs.MutableAction", () => {
	let template, zoneMock, instructionMock, conditionMock;

	beforeEach(() => {
		zoneMock = {};
		conditionMock = {};
		instructionMock = {};

		template = new Action();
		template.id = 5;
		template.name = "";
		template.zone = zoneMock;
		template.conditions = [conditionMock];
		template.instructions = [instructionMock];
	});

	it("can be initialized from an action to make a mutable copy", () => {
		let copy = new Action(template);

		expect(copy.id).toBe(5);
		expect(copy.name).toBe("");
		expect(copy.zone).toBe(zoneMock);
		expect(copy.conditions).toEqual([conditionMock]);
		expect(copy.instructions).toEqual([instructionMock]);
	});
});
