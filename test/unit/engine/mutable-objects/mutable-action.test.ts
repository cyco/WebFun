import Action from "src/engine/mutable-objects/mutable-action";
import { Zone, Instruction, Condition } from "src/engine/objects";

describe("WebFun.Engine.MutableObjecs.MutableAction", () => {
	let template: Action;
	let zoneMock: Zone;
	let instructionMock: Instruction;
	let conditionMock: Condition;

	beforeEach(() => {
		zoneMock = {} as any;
		conditionMock = {} as any;
		instructionMock = {} as any;

		template = new Action();
		template.id = 5;
		template.name = "";
		template.zone = zoneMock;
		template.conditions = [conditionMock];
		template.instructions = [instructionMock];
	});

	it("can be initialized from an action to make a mutable copy", () => {
		const copy = new Action(template);

		expect(copy.id).toBe(5);
		expect(copy.name).toBe("");
		expect(copy.zone).toBe(zoneMock);
		expect(copy.conditions).toEqual([conditionMock]);
		expect(copy.instructions).toEqual([instructionMock]);
	});
});
