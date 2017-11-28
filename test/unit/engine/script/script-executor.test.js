import ScriptExecutor from "src/engine/script/script-executor";
import { ResultFlags } from "src/engine/script/types";

describe("ScriptExecutor", () => {
	let evaluator, engine, action;
	beforeEach(() => {
		engine = {};

		action = {
			enabled: true,
			instructionPointer: 0
		};

		evaluator = new ScriptExecutor();
		evaluator.engine = engine;
	});

	it("has an accessor for the engine property", () => {
		expect(evaluator.engine).toBe(engine);
	});

	describe("actionDoesApply is a function to check if an action should be considered for execution", () => {
		it("returns false for actions that are neither enabled nor have been partly executed ", async (done) => {
			action.enabled = false;
			action.instructionPointer = 0;

			expect(await evaluator.actionDoesApply(action)).toBeFalse();

			done();
		});

		it("returns true if enabled and all conditions check out", async (done) => {
			action.conditions = [];
			action.enabled = true;
			expect(await evaluator.actionDoesApply(action)).toBeTrue();

			done();
		});

		it("returns true if it has been partly executed and all conditions check out", async (done) => {
			action.enabled = false;
			action.instructionPointer = 1;
			action.conditions = [];
			expect(await evaluator.actionDoesApply(action)).toBeTrue();

			done();
		});

		it("uses a condition checker to test all conditions", async (done) => {
			action.enabled = true;
			action.instructionPointer = 0;

			const checker = {
				check() {
				}
			};
			evaluator._checker = checker;

			spyOn(checker, "check").and.returnValue(true);

			action.conditions = ["condition-1", "condition-2", "condition-3"];
			expect(await evaluator.actionDoesApply(action)).toBeTrue();
			expect(checker.check).toHaveBeenCalledTimes(3);

			done();
		});

		it("returns false if one condition check fails", async (done) => {
			const checker = {
				check() {
				}
			};
			evaluator._checker = checker;

			spyOn(checker, "check").and.returnValue(false);

			action.conditions = ["condition-1", "condition-2", "condition-3"];
			expect(await evaluator.actionDoesApply(action)).toBeFalse();

			done();
		});

		it("stops execution early if one condition fails", async (done) => {
			const checker = {
				check() {
				}
			};
			evaluator._checker = checker;

			spyOn(checker, "check").and.returnValue(false);

			action.conditions = ["condition-1", "condition-2", "condition-3"];
			await evaluator.actionDoesApply(action);

			expect(checker.check).toHaveBeenCalledTimes(1);
			done();
		});
	});

	describe("execute intructions", () => {
		let executor;
		beforeEach(() => {
			executor = {
				execute() {}
			};
			evaluator._executor = executor;
		});

		it("executes all instructions in an action", async (done) => {
			const action = {instructions: ["instruction1", "instruction2"]};
			spyOn(executor, "execute").and.returnValue(ResultFlags.OK);

			await evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledTimes(2);

			done();
		});

		it("starts execution at the instruction pointer", async (done) => {
			const action = {instructions: ["instruction1", "instruction2"], instructionPointer: 1};
			spyOn(executor, "execute");

			await evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledWith("instruction2");

			done();
		});

		it("stops executing instructions when an instruction returns wait", async (done) => {
			const action = {instructions: ["instruction1", "instruction2"], instructionPointer: 0};
			spyOn(executor, "execute").and.returnValue(ResultFlags.Wait);

			await evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledTimes(1);
			expect(action.instructionPointer).toBe(1);

			done();
		});
	});
});
