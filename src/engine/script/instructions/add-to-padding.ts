import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x23;
export const Arguments = 1;
export const Description = "Add `arg_0` to current zone's `padding` value";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.currentZone.padding += instruction.arguments[0];

	return Result.OK;
};
