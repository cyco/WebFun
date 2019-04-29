import AbstractActionItem from "src/engine/objects/abstract-action-item";
import Action from "src/engine/objects/action";
import Condition from "src/engine/objects/condition";
import Instruction from "src/engine/objects/instruction";

describe("WebFun.Engine.Objects.Action", () => {
	let subject;
	beforeEach(() => (subject = new Action()));

	it("can have several conditions", () => {
		expect(subject.conditions).toEqual([]);
	});

	it("can have several instructions", () => {
		expect(subject.instructions).toEqual([]);
	});

	it("has an instruction pointer that is initially set to 0", () => {
		expect(subject.instructionPointer).toBe(0);
	});

	it("has an id", () => {
		expect(subject.id).toBe(-1);
	});

	it("is initially enabled", () => {
		expect(subject.enabled).toBeTrue();
	});

	it("holds a reference to its zone", () => {
		expect(subject.zone).toBeNull();
	});

	it("has a name (eventhough it's only used in indy)", () => {
		expect(subject.name).toBe("");
	});

	describe("AbstractActionItem", () => {
		it("is a common (private) base class for instructions and conditions", () => {
			expect(typeof AbstractActionItem).toBe("function");
		});
	});

	describe("Instruction", () => {
		it("extends AbstractActionItem", () => {
			const instruction = new Instruction({});
			expect(instruction instanceof AbstractActionItem).toBeTrue();
		});

		it("may have 'additional data' of arbitrary length (usually text someone speaks)", () => {
			const instruction = new Instruction({});
			instruction._additionalData = "something someone might say";
			expect(instruction.text).toEqual("something someone might say");
		});
	});

	describe("Condition", () => {
		it("extends AbstractActionItem", () => {
			const condition = new Condition({});
			expect(condition instanceof AbstractActionItem).toBeTrue();
		});
	});
});
