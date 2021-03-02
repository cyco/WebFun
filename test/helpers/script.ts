import {
	Result,
	ConditionChecker,
	EvaluationMode,
	InstructionExecutor
} from "../../src/engine/script";
import { ConditionImplementations } from "src/engine/script/conditions";
import { InstructionImplementations } from "src/engine/script/instructions";
import { Condition, Instruction } from "src/engine/objects";
import { Engine, AssetManager } from "src/engine";

type JasmineDescribe = (description: string, block: () => void) => void;
type ConditionTester = (
	check: (condition: Condition, mode?: EvaluationMode) => Promise<boolean>,
	engine: Engine
) => void;
type InstructionTester = (
	check: (instruction: Instruction, mode: EvaluationMode) => void,
	engine: Engine
) => Promise<Result>;

const makeConditionDescription = (
	desc: JasmineDescribe
): ((name: string, block: ConditionTester) => void) => (Name, block) => {
	desc(`WebFun.Engine.Script.Condition.${Name}`, () => {
		const engine: any = mockEngine();
		const checker: any = new ConditionChecker(ConditionImplementations, engine);

		beforeEach(() => Object.assign(engine, mockEngine()));

		block(
			async (condition: Condition, mode: EvaluationMode) =>
				await checker.check(condition, mode, engine.currentZone),
			engine
		);
	});
};

const makeInstructionDescription = (desc: JasmineDescribe) => (
	Name: string,
	block: InstructionTester
) => {
	desc(`WebFun.Engine.Script.Instruction.${Name}`, () => {
		const engine = mockEngine();
		const executor = new InstructionExecutor(InstructionImplementations, engine);

		beforeEach(() => Object.assign(engine, mockEngine()));

		block(async instruction => {
			executor.action = {
				zone: engine.currentZone,
				instructions: [instruction]
			} as any;
			return await executor.execute(instruction);
		}, engine);
	});
};

function mockEngine(): Engine {
	return {
		currentZone: { setTile: (): void => void 0, getTile: (): void => void 0 },
		hero: {},
		assets: new AssetManager(),
		currentWorld: {
			findLocationOfZone: (): void => void 0,
			at: (): void => void 0,
			findSectorContainingZone: (): void => void 0
		},
		speak: (): void => void 0,
		dropItem: (): void => void 0,
		persistentState: {},
		sceneManager: { pushScene: (): void => void 0 },
		mixer: { play: (): void => void 0 },
		inventory: { contains: (): boolean => false },
		inputManager: {},
		findLocationOfZone: (): void => void 0
	} as any;
}

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
