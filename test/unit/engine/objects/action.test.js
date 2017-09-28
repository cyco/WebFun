import Action from "src/engine/objects/action";
import AbstractActionItem from "src/engine/objects/abstract-action-item";
import Instruction from "src/engine/objects/instruction";
import Condition from "src/engine/objects/condition";

describe("Action", () => {
	let action;
	beforeEach(() => {
		action = new Action();
	});

	it("can have several conditions", () => {
		expect(action.conditions).toEqual([]);
	});

	it("can have several instructions", () => {
		expect(action.instructions).toEqual([]);
	});

	it("has an instruction pointer that is initially set to 0", () => {
		expect(action.instructionPointer).toBe(0);
	});

	it("is initially enabled", () => {
		expect(action.enabled).toBeTrue();
	});

	describe("AbstractActionItem", () => {
		it("is a common (private) base class for instructions and conditions", () => {
			expect(typeof AbstractActionItem).toBe("function");
		});
	});

	describe("Instruction", () => {
		it("extends AbstractActionItem", () => {
			let instruction = new Instruction({});
			expect(instruction instanceof AbstractActionItem).toBeTrue();
		});

		it("may have 'additional data' of arbitrary length (usually text someone speaks)", () => {
			let instruction = new Instruction({});
			instruction._additionalData = "something someone might say";
			expect(instruction.text).toEqual("something someone might say");
		});
	});

	describe("Condition", () => {
		it("extends AbstractActionItem", () => {
			let condition = new Condition({});
			expect(condition instanceof AbstractActionItem).toBeTrue();
		});
	});
});
