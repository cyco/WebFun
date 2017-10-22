import ConditionChecker from "../../src/engine/script/condition-checker";
import InstructionExecutor from "../../src/engine/script/instruction-executor";
import Conditions from "src/engine/script/conditions";
import Instructions from "src/engine/script/instructions";

const makeConditionDescription = (desc) => (Name, block) => {
	desc(`Condition ${Name}`, () => {
		let engine = {};
		let checker = new ConditionChecker(Conditions, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = {location: {}};
			engine.persistentState = {};
			engine.state = {};
		});

		block(checker.check.bind(checker), engine);
	});
};

const makeInstructionDescription = (desc) => (Name, block) => {
	desc(`Instruction ${Name}`, () => {
		let engine = {
			currentZone: {},
			hero: {},
			state: {},
			data: {}
		};
		let executor = new InstructionExecutor(Instructions, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = {};
			engine.state = {};
			engine.data = {};
		});

		block(executor.execute.bind(executor), engine);
	});
};

export const describeCondition = makeConditionDescription(describe);
export const xdescribeCondition = makeConditionDescription(xdescribe);
export const fdescribeCondition = makeConditionDescription(fdescribe);

export const describeInstruction = makeInstructionDescription(describe);
export const xdescribeInstruction = makeInstructionDescription(xdescribe);
export const fdescribeInstruction = makeInstructionDescription(fdescribe);
