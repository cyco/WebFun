import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x0d;
export const Arguments = 1;
export const Description = "Set current zone's `counter` value to a `arg_0`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.currentZone.counter = instruction.arguments[0];

	return Result.OK;
};
