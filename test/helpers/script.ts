import { Result, ConditionChecker, EvaluationMode, InstructionExecutor } from "../../src/engine/script";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Condition, Instruction } from "src/engine/objects";
import { Engine, AssetManager } from "src/engine";
import { Point } from "src/util";

type JasmineDescribe = (description: string, block: () => void) => void;
type ConditionTester = (check: (condition: Condition, mode?: EvaluationMode) => void, engine: Engine) => void;
type InstructionTester = (
	check: (instruction: Instruction, mode: EvaluationMode) => void,
	engine: Engine
) => Promise<Result>;

const makeConditionDescription = (
	desc: JasmineDescribe
): ((name: string, block: ConditionTester) => void) => (Name, block) => {
	desc(`WebFun.Engine.Script.Condition.${Name}`, () => {
		const engine = {} as any;
		const checker = new ConditionChecker(ConditionImplementations, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.hero = { location: new Point(0, 0) };
			engine.persistentState = {};
			engine.temporaryState = {};
			engine.sceneManager = { pushScene() {} };
			engine.assetManager = new AssetManager();
		});

		block(
			(condition: Condition, mode: EvaluationMode) =>
				checker.check(condition, mode, engine.currentZone),
			engine
		);
	});
};

const makeInstructionDescription = (desc: JasmineDescribe) => (Name: string, block: InstructionTester) => {
	desc(`WebFun.Engine.Script.Instruction.${Name}`, () => {
		const engine = {
			currentZone: {},
			hero: {},
			temporaryState: {},
			assetManager: new AssetManager(),
			currentWorld: {
				locationOfZone: (): void => void 0,
				at: (): void => void 0
			},
			speak: (): void => void 0,
			dropItem: (): void => void 0
		} as any;
		const executor = new InstructionExecutor(InstructionImplementations, engine);

		beforeEach(() => {
			engine.currentZone = {};
			engine.currentWorld = {
				locationOfZone: (): void => void 0,
				at: (): void => void 0,
				itemForZone: (): void => void 0
			};
			engine.hero = { location: new Point(0, 0) };
			engine.temporaryState = {};
			engine.data = {};
			engine.sceneManager = { pushScene() {} };
			engine.assetManager = new AssetManager();
			engine.mixer = {
				play: (): void => void 0
			};
		});

		block(async instruction => {
			executor.action = {
				zone: engine.currentZone,
				instructions: [instruction]
			} as any;
			return await executor.execute(instruction);
		}, engine);
	});
};

export const describeCondition = makeConditionDescription(describe);
export const xdescribeCondition = makeConditionDescription(xdescribe);
export const fdescribeCondition = makeConditionDescription(fdescribe);

declare global {
	let describeCondition: (name: string, block: ConditionTester) => void;
	let xdescribeCondition: (name: string, block: ConditionTester) => void;
	let fdescribeCondition: (name: string, block: ConditionTester) => void;
}

export const describeInstruction = makeInstructionDescription(describe);
export const xdescribeInstruction = makeInstructionDescription(xdescribe);
export const fdescribeInstruction = makeInstructionDescription(fdescribe);

declare global {
	let describeInstruction: (name: string, cb: (ex: Function, engine: any) => void) => void;
	let xdescribeInstruction: (name: string, cb: (ex: Function, engine: any) => void) => void;
	let fdescribeInstruction: (name: string, cb: (ex: Function, engine: any) => void) => void;
}
