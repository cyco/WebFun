import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x0e;
export const Arguments = 1;
export const Description = "Add `arg_0` to current zone's `counter` value";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.currentZone.counter += instruction.arguments[0];

	return Result.OK;
};
