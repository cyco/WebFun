import ConditionChecker from "../../src/engine/script/condition-checker";
import InstructionExecutor from "../../src/engine/script/instruction-executor";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Point } from "src/util";

const makeConditionDescription = desc => (Name, block) => {
	desc(`WebFun.Engine.Script.Condition.${Name}`, () => {
		let engine = {};
		let currentZone = {};
		let checker = new ConditionChecker(ConditionImplementations, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = { location: new Point(0, 0) };
			engine.persistentState = {};
			engine.temporaryState = {};
			engine.sceneManager = { pushScene() {} };
		});

		block((condition, mode) => checker.check(condition, mode, engine.currentZone), engine);
	});
};

const makeInstructionDescription = desc => (Name, block) => {
	desc(`WebFun.Engine.Script.Instruction.${Name}`, () => {
		let engine = {
			currentZone: {},
			hero: {},
			temporaryState: {},
			data: {}
		};
		let executor = new InstructionExecutor(InstructionImplementations, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = { location: new Point(0, 0) };
			engine.temporaryState = {};
			engine.data = {};
			engine.sceneManager = { pushScene() {} };
			engine.mixer = {
				effectChannel: { playSound: () => void 0 },
				musicChannel: { playSound: () => void 0 }
			};
		});

		block(async instruction => {
			executor.action = {
				zone: engine.currentZone,
				instructions: [instruction]
			};
			return await executor.execute(instruction, engine);
		}, engine);
	});
};

export const describeCondition = makeConditionDescription(describe);
export const xdescribeCondition = makeConditionDescription(xdescribe);
export const fdescribeCondition = makeConditionDescription(fdescribe);

export const describeInstruction = makeInstructionDescription(describe);
export const xdescribeInstruction = makeInstructionDescription(xdescribe);
export const fdescribeInstruction = makeInstructionDescription(fdescribe);
