import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x24;
export const Arguments = 1;
export const Description = "Set current zone's `random` value to a `arg_0`";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	engine.currentZone.random = instruction.arguments[0];
	return ResultFlags.OK;
};
